import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(c,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="19 | CountDownLatch和CyclicBarrier：如何让多线程步调一致？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/f7/c1/f7c9640777373dfd09007417872c34c1.mp3"></audio></p><p>前几天老板突然匆匆忙忙过来，说对账系统最近越来越慢了，能不能快速优化一下。我了解了对账系统的业务后，发现还是挺简单的，用户通过在线商城下单，会生成电子订单，保存在订单库；之后物流会生成派送单给用户发货，派送单保存在派送单库。为了防止漏派送或者重复派送，对账系统每天还会校验是否存在异常订单。</p><p>对账系统的处理逻辑很简单，你可以参考下面的对账系统流程图。目前对账系统的处理逻辑是首先查询订单，然后查询派送单，之后对比订单和派送单，将差异写入差异库。</p><img src="https://static001.geekbang.org/resource/image/06/fe/068418bdc371b8a1b4b740428a3b3ffe.png" alt=""><p>对账系统的代码抽象之后，也很简单，核心代码如下，就是在一个单线程里面循环查询订单、派送单，然后执行对账，最后将写入差异库。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>while(存在未对账订单){</span></span>
<span class="line"><span>  // 查询未对账订单</span></span>
<span class="line"><span>  pos = getPOrders();</span></span>
<span class="line"><span>  // 查询派送单</span></span>
<span class="line"><span>  dos = getDOrders();</span></span>
<span class="line"><span>  // 执行对账操作</span></span>
<span class="line"><span>  diff = check(pos, dos);</span></span>
<span class="line"><span>  // 差异写入差异库</span></span>
<span class="line"><span>  save(diff);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="利用并行优化对账系统" tabindex="-1"><a class="header-anchor" href="#利用并行优化对账系统"><span>利用并行优化对账系统</span></a></h2><p>老板要我优化性能，那我就首先要找到这个对账系统的瓶颈所在。</p><p>目前的对账系统，由于订单量和派送单量巨大，所以查询未对账订单getPOrders()和查询派送单getDOrders()相对较慢，那有没有办法快速优化一下呢？目前对账系统是单线程执行的，图形化后是下图这个样子。对于串行化的系统，优化性能首先想到的是能否<strong>利用多线程并行处理</strong>。</p><img src="https://static001.geekbang.org/resource/image/cd/a5/cd997c259e4165c046e79e766abfe2a5.png" alt=""><p>所以，这里你应该能够看出来这个对账系统里的瓶颈：查询未对账订单getPOrders()和查询派送单getDOrders()是否可以并行处理呢？显然是可以的，因为这两个操作并没有先后顺序的依赖。这两个最耗时的操作并行之后，执行过程如下图所示。对比一下单线程的执行示意图，你会发现同等时间里，并行执行的吞吐量近乎单线程的2倍，优化效果还是相对明显的。</p><img src="https://static001.geekbang.org/resource/image/a5/3b/a563c39ece918578ad2ff33ab5f3743b.png" alt=""><p>思路有了，下面我们再来看看如何用代码实现。在下面的代码中，我们创建了两个线程T1和T2，并行执行查询未对账订单getPOrders()和查询派送单getDOrders()这两个操作。在主线程中执行对账操作check()和差异写入save()两个操作。不过需要注意的是：主线程需要等待线程T1和T2执行完才能执行check()和save()这两个操作，为此我们通过调用T1.join()和T2.join()来实现等待，当T1和T2线程退出时，调用T1.join()和T2.join()的主线程就会从阻塞态被唤醒，从而执行之后的check()和save()。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>while(存在未对账订单){</span></span>
<span class="line"><span>  // 查询未对账订单</span></span>
<span class="line"><span>  Thread T1 = new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>    pos = getPOrders();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  T1.start();</span></span>
<span class="line"><span>  // 查询派送单</span></span>
<span class="line"><span>  Thread T2 = new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>    dos = getDOrders();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  T2.start();</span></span>
<span class="line"><span>  // 等待T1、T2结束</span></span>
<span class="line"><span>  T1.join();</span></span>
<span class="line"><span>  T2.join();</span></span>
<span class="line"><span>  // 执行对账操作</span></span>
<span class="line"><span>  diff = check(pos, dos);</span></span>
<span class="line"><span>  // 差异写入差异库</span></span>
<span class="line"><span>  save(diff);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="用countdownlatch实现线程等待" tabindex="-1"><a class="header-anchor" href="#用countdownlatch实现线程等待"><span>用CountDownLatch实现线程等待</span></a></h2><p>经过上面的优化之后，基本上可以跟老板汇报收工了，但还是有点美中不足，相信你也发现了，while循环里面每次都会创建新的线程，而创建线程可是个耗时的操作。所以最好是创建出来的线程能够循环利用，估计这时你已经想到线程池了，是的，线程池就能解决这个问题。</p><p>而下面的代码就是用线程池优化后的：我们首先创建了一个固定大小为2的线程池，之后在while循环里重复利用。一切看上去都很顺利，但是有个问题好像无解了，那就是主线程如何知道getPOrders()和getDOrders()这两个操作什么时候执行完。前面主线程通过调用线程T1和T2的join()方法来等待线程T1和T2退出，但是在线程池的方案里，线程根本就不会退出，所以join()方法已经失效了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 创建2个线程的线程池</span></span>
<span class="line"><span>Executor executor = </span></span>
<span class="line"><span>  Executors.newFixedThreadPool(2);</span></span>
<span class="line"><span>while(存在未对账订单){</span></span>
<span class="line"><span>  // 查询未对账订单</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt; {</span></span>
<span class="line"><span>    pos = getPOrders();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  // 查询派送单</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt; {</span></span>
<span class="line"><span>    dos = getDOrders();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  /* ？？如何实现等待？？*/</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 执行对账操作</span></span>
<span class="line"><span>  diff = check(pos, dos);</span></span>
<span class="line"><span>  // 差异写入差异库</span></span>
<span class="line"><span>  save(diff);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那如何解决这个问题呢？你可以开动脑筋想出很多办法，最直接的办法是弄一个计数器，初始值设置成2，当执行完<code>pos = getPOrders();</code>这个操作之后将计数器减1，执行完<code>dos = getDOrders();</code>之后也将计数器减1，在主线程里，等待计数器等于0；当计数器等于0时，说明这两个查询操作执行完了。等待计数器等于0其实就是一个条件变量，用管程实现起来也很简单。</p><p>不过我并不建议你在实际项目中去实现上面的方案，因为Java并发包里已经提供了实现类似功能的工具类：<strong>CountDownLatch</strong>，我们直接使用就可以了。下面的代码示例中，在while循环里面，我们首先创建了一个CountDownLatch，计数器的初始值等于2，之后在<code>pos = getPOrders();</code>和<code>dos = getDOrders();</code>两条语句的后面对计数器执行减1操作，这个对计数器减1的操作是通过调用 <code>latch.countDown();</code> 来实现的。在主线程中，我们通过调用 <code>latch.await()</code> 来实现对计数器等于0的等待。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 创建2个线程的线程池</span></span>
<span class="line"><span>Executor executor = </span></span>
<span class="line"><span>  Executors.newFixedThreadPool(2);</span></span>
<span class="line"><span>while(存在未对账订单){</span></span>
<span class="line"><span>  // 计数器初始化为2</span></span>
<span class="line"><span>  CountDownLatch latch = </span></span>
<span class="line"><span>    new CountDownLatch(2);</span></span>
<span class="line"><span>  // 查询未对账订单</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt; {</span></span>
<span class="line"><span>    pos = getPOrders();</span></span>
<span class="line"><span>    latch.countDown();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  // 查询派送单</span></span>
<span class="line"><span>  executor.execute(()-&amp;gt; {</span></span>
<span class="line"><span>    dos = getDOrders();</span></span>
<span class="line"><span>    latch.countDown();</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 等待两个查询操作结束</span></span>
<span class="line"><span>  latch.await();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 执行对账操作</span></span>
<span class="line"><span>  diff = check(pos, dos);</span></span>
<span class="line"><span>  // 差异写入差异库</span></span>
<span class="line"><span>  save(diff);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="进一步优化性能" tabindex="-1"><a class="header-anchor" href="#进一步优化性能"><span>进一步优化性能</span></a></h2><p>经过上面的重重优化之后，长出一口气，终于可以交付了。不过在交付之前还需要再次审视一番，看看还有没有优化的余地，仔细看还是有的。</p><p>前面我们将getPOrders()和getDOrders()这两个查询操作并行了，但这两个查询操作和对账操作check()、save()之间还是串行的。很显然，这两个查询操作和对账操作也是可以并行的，也就是说，在执行对账操作的时候，可以同时去执行下一轮的查询操作，这个过程可以形象化地表述为下面这幅示意图。</p><img src="https://static001.geekbang.org/resource/image/e6/8b/e663d90f49d9666e618ac1370ccca58b.png" alt=""><p>那接下来我们再来思考一下如何实现这步优化，两次查询操作能够和对账操作并行，对账操作还依赖查询操作的结果，这明显有点生产者-消费者的意思，两次查询操作是生产者，对账操作是消费者。既然是生产者-消费者模型，那就需要有个队列，来保存生产者生产的数据，而消费者则从这个队列消费数据。</p><p>不过针对对账这个项目，我设计了两个队列，并且两个队列的元素之间还有对应关系。具体如下图所示，订单查询操作将订单查询结果插入订单队列，派送单查询操作将派送单插入派送单队列，这两个队列的元素之间是有一一对应的关系的。两个队列的好处是，对账操作可以每次从订单队列出一个元素，从派送单队列出一个元素，然后对这两个元素执行对账操作，这样数据一定不会乱掉。</p><img src="https://static001.geekbang.org/resource/image/22/da/22e8ba1c04a3bc2605b98376ed6832da.png" alt=""><p>下面再来看如何用双队列来实现完全的并行。一个最直接的想法是：一个线程T1执行订单的查询工作，一个线程T2执行派送单的查询工作，当线程T1和T2都各自生产完1条数据的时候，通知线程T3执行对账操作。这个想法虽看上去简单，但其实还隐藏着一个条件，那就是线程T1和线程T2的工作要步调一致，不能一个跑得太快，一个跑得太慢，只有这样才能做到各自生产完1条数据的时候，通知线程T3。</p><p>下面这幅图形象地描述了上面的意图：线程T1和线程T2只有都生产完1条数据的时候，才能一起向下执行，也就是说，线程T1和线程T2要互相等待，步调要一致；同时当线程T1和T2都生产完一条数据的时候，还要能够通知线程T3执行对账操作。</p><img src="https://static001.geekbang.org/resource/image/65/ad/6593a10a393d9310a8f864730f7426ad.png" alt=""><h2 id="用cyclicbarrier实现线程同步" tabindex="-1"><a class="header-anchor" href="#用cyclicbarrier实现线程同步"><span>用CyclicBarrier实现线程同步</span></a></h2><p>下面我们就来实现上面提到的方案。这个方案的难点有两个：一个是线程T1和T2要做到步调一致，另一个是要能够通知到线程T3。</p><p>你依然可以利用一个计数器来解决这两个难点，计数器初始化为2，线程T1和T2生产完一条数据都将计数器减1，如果计数器大于0则线程T1或者T2等待。如果计数器等于0，则通知线程T3，并唤醒等待的线程T1或者T2，与此同时，将计数器重置为2，这样线程T1和线程T2生产下一条数据的时候就可以继续使用这个计数器了。</p><p>同样，还是建议你不要在实际项目中这么做，因为Java并发包里也已经提供了相关的工具类：<strong>CyclicBarrier</strong>。在下面的代码中，我们首先创建了一个计数器初始值为2的CyclicBarrier，你需要注意的是创建CyclicBarrier的时候，我们还传入了一个回调函数，当计数器减到0的时候，会调用这个回调函数。</p><p>线程T1负责查询订单，当查出一条时，调用 <code>barrier.await()</code> 来将计数器减1，同时等待计数器变成0；线程T2负责查询派送单，当查出一条时，也调用 <code>barrier.await()</code> 来将计数器减1，同时等待计数器变成0；当T1和T2都调用 <code>barrier.await()</code> 的时候，计数器会减到0，此时T1和T2就可以执行下一条语句了，同时会调用barrier的回调函数来执行对账操作。</p><p>非常值得一提的是，CyclicBarrier的计数器有自动重置的功能，当减到0的时候，会自动重置你设置的初始值。这个功能用起来实在是太方便了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 订单队列</span></span>
<span class="line"><span>Vector&amp;lt;P&amp;gt; pos;</span></span>
<span class="line"><span>// 派送单队列</span></span>
<span class="line"><span>Vector&amp;lt;D&amp;gt; dos;</span></span>
<span class="line"><span>// 执行回调的线程池 </span></span>
<span class="line"><span>Executor executor = </span></span>
<span class="line"><span>  Executors.newFixedThreadPool(1);</span></span>
<span class="line"><span>final CyclicBarrier barrier =</span></span>
<span class="line"><span>  new CyclicBarrier(2, ()-&amp;gt;{</span></span>
<span class="line"><span>    executor.execute(()-&amp;gt;check());</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void check(){</span></span>
<span class="line"><span>  P p = pos.remove(0);</span></span>
<span class="line"><span>  D d = dos.remove(0);</span></span>
<span class="line"><span>  // 执行对账操作</span></span>
<span class="line"><span>  diff = check(p, d);</span></span>
<span class="line"><span>  // 差异写入差异库</span></span>
<span class="line"><span>  save(diff);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void checkAll(){</span></span>
<span class="line"><span>  // 循环查询订单库</span></span>
<span class="line"><span>  Thread T1 = new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>    while(存在未对账订单){</span></span>
<span class="line"><span>      // 查询订单库</span></span>
<span class="line"><span>      pos.add(getPOrders());</span></span>
<span class="line"><span>      // 等待</span></span>
<span class="line"><span>      barrier.await();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  T1.start();  </span></span>
<span class="line"><span>  // 循环查询运单库</span></span>
<span class="line"><span>  Thread T2 = new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>    while(存在未对账订单){</span></span>
<span class="line"><span>      // 查询运单库</span></span>
<span class="line"><span>      dos.add(getDOrders());</span></span>
<span class="line"><span>      // 等待</span></span>
<span class="line"><span>      barrier.await();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  T2.start();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>CountDownLatch和CyclicBarrier是Java并发包提供的两个非常易用的线程同步工具类，这两个工具类用法的区别在这里还是有必要再强调一下：<strong>CountDownLatch主要用来解决一个线程等待多个线程的场景</strong>，可以类比旅游团团长要等待所有的游客到齐才能去下一个景点；而<strong>CyclicBarrier是一组线程之间互相等待</strong>，更像是几个驴友之间不离不弃。除此之外CountDownLatch的计数器是不能循环利用的，也就是说一旦计数器减到0，再有线程调用await()，该线程会直接通过。但<strong>CyclicBarrier的计数器是可以循环利用的</strong>，而且具备自动重置的功能，一旦计数器减到0会自动重置到你设置的初始值。除此之外，CyclicBarrier还可以设置回调函数，可以说是功能丰富。</p><p>本章的示例代码中有两处用到了线程池，你现在只需要大概了解即可，因为线程池相关的知识咱们专栏后面还会有详细介绍。另外，线程池提供了Future特性，我们也可以利用Future特性来实现线程之间的等待，这个后面我们也会详细介绍。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>本章最后的示例代码中，CyclicBarrier的回调函数我们使用了一个固定大小的线程池，你觉得是否有必要呢？</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,44)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB/19%20_%20CountDownLatch%E5%92%8CCyclicBarrier%EF%BC%9A%E5%A6%82%E4%BD%95%E8%AE%A9%E5%A4%9A%E7%BA%BF%E7%A8%8B%E6%AD%A5%E8%B0%83%E4%B8%80%E8%87%B4%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"前几天老板突然匆匆忙忙过来，说对账系统最近越来越慢了，能不能快速优化一下。我了解了对账系统的业务后，发现还是挺简单的，用户通过在线商城下单，会生成电子订单，保存在订单库；之后物流会生成派送单给用户发货，派送单保存在派送单库。为了防止漏派送或者重复派送，对账系统每天还会校验是否存在异常订单。 对账系统的处理逻辑很简单，你可以参考下面的对账系统流程图。目前...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB/19%20_%20CountDownLatch%E5%92%8CCyclicBarrier%EF%BC%9A%E5%A6%82%E4%BD%95%E8%AE%A9%E5%A4%9A%E7%BA%BF%E7%A8%8B%E6%AD%A5%E8%B0%83%E4%B8%80%E8%87%B4%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"前几天老板突然匆匆忙忙过来，说对账系统最近越来越慢了，能不能快速优化一下。我了解了对账系统的业务后，发现还是挺简单的，用户通过在线商城下单，会生成电子订单，保存在订单库；之后物流会生成派送单给用户发货，派送单保存在派送单库。为了防止漏派送或者重复派送，对账系统每天还会校验是否存在异常订单。 对账系统的处理逻辑很简单，你可以参考下面的对账系统流程图。目前..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":11.35,"words":3405},"filePathRelative":"posts/Java并发编程实战/第二部分：并发工具类/19 _ CountDownLatch和CyclicBarrier：如何让多线程步调一致？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"19 | CountDownLatch和CyclicBarrier：如何让多线程步调一致？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/f7/c1/f7c9640777373dfd09007417872c34c1.mp3\\"></audio></p>\\n<p>前几天老板突然匆匆忙忙过来，说对账系统最近越来越慢了，能不能快速优化一下。我了解了对账系统的业务后，发现还是挺简单的，用户通过在线商城下单，会生成电子订单，保存在订单库；之后物流会生成派送单给用户发货，派送单保存在派送单库。为了防止漏派送或者重复派送，对账系统每天还会校验是否存在异常订单。</p>","autoDesc":true}');export{t as comp,v as data};
