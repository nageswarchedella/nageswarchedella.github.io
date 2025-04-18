---
title: "Comparing Fault Tolerance: \n Elixir (BEAM) vs. NestJS (Node.js)"
date: 2024-12-27
---

Building a highly resilient application often means asking, "What happens when something goes wrong?" In other words, how does your runtime or framework behave when the unexpected occurs &mdash; an unhandled exception, a crashed worker, or a transient network error?

In this article, we'll explore the differences in fault tolerance and resilience when comparing Elixir (and the BEAM virtual machine) to NestJS (running on Node.js). We'll see how Elixir's "let it crash" philosophy makes fault tolerance a core language/runtime feature, whereas NestJS typically relies on custom solutions and external tooling.

## Elixir and the BEAM: Built-In Fault Tolerance

Elixir is a modern language that compiles to bytecode for the Erlang VM, also known as the BEAM. Erlang was created decades ago to power highly reliable telecom systems - environments where downtime and crashes were simply not acceptable. As a result, fault tolerance is deeply ingrained in both Erlang and Elixir.

### "Let It Crash" Philosophy

Instead of defensively coding every possible error path, Elixir embraces a **"let it crash"** mentality. This means failing processes are **isolated** and can be **restarted** without bringing down the entire application. Crashes are treated as normal events, not catastrophic failures that compromise the entire runtime.

### Lightweight Processes

On the BEAM, each concurrent unit of work is a **process** with its own isolated heap. These processes:

- Have extremely low overhead (significantly lighter than OS threads).
- Are managed by a **preemptive scheduler** that ensures no single process starves others.

A single application can spawn **millions** of processes. Because processes are isolated, a crash in one process won't impact another's memory or state.

### Supervision Trees

A key feature of Elixir/Erlang is the **supervision tree**. A supervisor process monitors one or more child processes, automatically applying a **restart strategy** if a child crashes. These strategies might restart just the single failed process or broader groups of processes, depending on configuration. This built-in mechanism provides **automatic healing** and is central to the BEAM's fault-tolerant design.

### Distributed BEAM

Another major strength is the BEAM's **transparent distribution model**:

- Multiple BEAM nodes can be clustered together, sharing messages and processes across physical machines.
- This allows processes to be distributed seamlessly, further enhancing resilience and redundancy.

### Other Resiliency Features

- **Hot Code Swapping:** Enables upgrading parts of your code without stopping the system, minimizing downtime in mission-critical environments.
- **Extensive Tooling:** Erlang's standard library includes powerful tools for debugging, tracing, and monitoring at runtime.

## NestJS and Node.js: Building Resilience

NestJS is a popular framework for building TypeScript back-end applications on top of **Node.js**. While NestJS provides an excellent developer experience with a modular architecture, **it inherits Node.js's concurrency and error-handling model**, which differs from the BEAM.

### Single-Threaded Event Loop (With Options)

Node.js typically runs on a single-threaded, event-loop-based architecture, handling concurrency through asynchronous callbacks or promises. However, Node.js also offers additional concurrency mechanisms like:

**Worker Threads:** Execute CPU-bound tasks in parallel threads.

**Child Processes:** Offload tasks to separate processes.

Even so, these features are **not as natively integrated** into the runtime's core philosophy as BEAM's lightweight processes. They require explicit setup and management.

### Handling Unhandled Exceptions

If an exception goes unhandled in Node.js, the default behavior often leads to the entire process crashing. Developers can intercept such exceptions using:

- `process.on('uncaughtException', callback)`
- `process.on('unhandledRejection', callback)`

…but it's generally best practice to let the process terminate and rely on an external process manager (e.g., PM2, Kubernetes) to restart it. This ensures the application isn't left in an inconsistent state.

### External Supervisors and Libraries

Node.js itself doesn't provide a built-in equivalent to BEAM supervisors. Instead, developers typically use:

- **Process Managers** like PM2 or Docker/Kubernetes for restarting crashed services.
- **Circuit Breakers** and **Retry Logic** (e.g., libraries such as `opossum` or `cockatiel`).
- **Monitoring and Logging** (Winston, Pino, Sentry, Datadog, etc.).

While the Node.js ecosystem is robust and offers a variety of tools, it requires **piecemeal** integration and configuration. NestJS can tap into these libraries for resilience, but it's not as "batteries-included" as the BEAM's built-in fault tolerance.

## Key Differences

1. **Philosophical Approach**

   - **Elixir/BEAM:** Embraces failure as inevitable ("let it crash"), with lightweight processes supervised by default.
   - **NestJS/Node.js:** Often relies on external tooling, manual exception handling, and process managers to recover from crashes.

2. **Isolation**

   - **Elixir/BEAM:** Each process runs in isolated memory; one crash doesn't corrupt others.
   - **NestJS/Node.js:** By default, a crash in one part of the code can bring down the entire runtime, though Worker Threads or Child Processes can mitigate some of this.

3. **Recovery Model**

   - **Elixir/BEAM:** Supervisors automatically restart failed processes, resuming from a known good state.
   - **NestJS/Node.js:** Typically uses external managers (PM2, Docker, Kubernetes) or custom logic to restart the entire process.

4. **Distributed Capabilities**

   - **Elixir/BEAM:** Native clustering across multiple nodes, enabling straightforward process distribution.
   - **NestJS/Node.js:** Clustering is possible (e.g., via the cluster module or containers), but it's more manual and not as deeply integrated into the language/runtime.

5. **Built-In vs. Bolt-On**
   - **Elixir/BEAM:** Observability, fault tolerance, and concurrency primitives are built into the runtime itself.
   - **NestJS/Node.js:** Relies heavily on external libraries and orchestrators to achieve the same level of resilience.

### Do Global Exception Catchers Make Systems Safer?

In NestJS, you might implement a global exception filter to catch and handle errors consistently. This approach:

- Promotes _consistent error responses_ to clients.
- Allows _centralized logging_ of exceptions.

However, a global exception catcher _alone_ doesn't solve deeper problems of **fault tolerance** or **resiliency**. It won't prevent the application from crashing if an uncaught exception slips through, nor will it automatically restart a failed process. For truly robust, 24/7 systems, you still need:

- **Infrastructure support** (PM2, Kubernetes, Docker).
- **Monitoring and alerting** (Datadog, Prometheus, Sentry).
- **Resilient design patterns** (circuit breakers, retries, graceful degradation).

A global exception catcher is just one part of a broader reliability strategy.

### Conclusion

When it comes to fault tolerance, **Elixir and the BEAM** stand out for their deeply ingrained resilience features: lightweight and isolated processes, supervision trees, native clustering, and a "let it crash" philosophy that's built into the runtime. These capabilities make it straightforward to build **highly available, self-healing systems** without stitching together multiple third-party tools.

On the other hand, **NestJS (and Node.js)** can power enterprise-grade applications and achieve robust fault tolerance, but it typically depends on **additional tooling** &mdash; process managers, circuit breakers, logging frameworks, and container orchestration &mdash; to replicate similar behavior. This approach is more flexible but can require **significantly more manual configuration.**

Ultimately, both _Elixir_ and _NestJS_ can form the backbone of stable, resilient services. _Elixir_ simply provides fault tolerance "out of the box," while _NestJS_ requires careful layering of external components to reach comparable levels of resilience. Your choice depends on team expertise, project requirements, and the ecosystem you're most comfortable working in.
