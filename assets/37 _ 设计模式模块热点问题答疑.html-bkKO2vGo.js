import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const l={};function p(r,n){return i(),a("div",null,n[0]||(n[0]=[e(`<p><audio id="audio" title="37 | 设计模式模块热点问题答疑" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/18/e4/182e9c98c3f15dba1035af1defc512e4.mp3"></audio></p><p>多线程设计模式是前人解决并发问题的经验总结，当我们试图解决一个并发问题时，首选方案往往是使用匹配的设计模式，这样能避免走弯路。同时，由于大家都熟悉设计模式，所以使用设计模式还能提升方案和代码的可理解性。</p><p>在这个模块，我们总共介绍了9种常见的多线程设计模式。下面我们就对这9种设计模式做个分类和总结，同时也对前面各章的课后思考题做个答疑。</p><h2 id="避免共享的设计模式" tabindex="-1"><a class="header-anchor" href="#避免共享的设计模式"><span>避免共享的设计模式</span></a></h2><p><strong>Immutability模式</strong>、<strong>Copy-on-Write模式</strong>和<strong>线程本地存储模式</strong>本质上都是<strong>为了避免共享</strong>，只是实现手段不同而已。这3种设计模式的实现都很简单，但是实现过程中有些细节还是需要格外注意的。例如，<strong>使用Immutability模式需要注意对象属性的不可变性，使用Copy-on-Write模式需要注意性能问题，使用线程本地存储模式需要注意异步执行问题</strong>。所以，每篇文章最后我设置的课后思考题的目的就是提醒你注意这些细节。</p><p><a href="https://time.geekbang.org/column/article/92856" target="_blank" rel="noopener noreferrer">《28 | Immutability模式：如何利用不变性解决并发问题？》</a>的课后思考题是讨论Account这个类是不是具备不可变性。这个类初看上去属于不可变对象的中规中矩实现，而实质上这个实现是有问题的，原因在于StringBuffer不同于String，StringBuffer不具备不可变性，通过getUser()方法获取user之后，是可以修改user的。一个简单的解决方案是让getUser()方法返回String对象。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public final class Account{</span></span>
<span class="line"><span>  private final </span></span>
<span class="line"><span>    StringBuffer user;</span></span>
<span class="line"><span>  public Account(String user){</span></span>
<span class="line"><span>    this.user = </span></span>
<span class="line"><span>      new StringBuffer(user);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //返回的StringBuffer并不具备不可变性</span></span>
<span class="line"><span>  public StringBuffer getUser(){</span></span>
<span class="line"><span>    return this.user;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public String toString(){</span></span>
<span class="line"><span>    return &amp;quot;user&amp;quot;+user;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="https://time.geekbang.org/column/article/93154" target="_blank" rel="noopener noreferrer">《29 | Copy-on-Write模式：不是延时策略的COW》</a>的课后思考题是讨论Java SDK中为什么没有提供 CopyOnWriteLinkedList。这是一个开放性的问题，没有标准答案，但是性能问题一定是其中一个很重要的原因，毕竟完整地复制LinkedList性能开销太大了。</p><p><a href="https://time.geekbang.org/column/article/93745" target="_blank" rel="noopener noreferrer">《30 | 线程本地存储模式：没有共享，就没有伤害》</a>的课后思考题是在异步场景中，是否可以使用 Spring 的事务管理器。答案显然是不能的，Spring 使用 ThreadLocal 来传递事务信息，因此这个事务信息是不能跨线程共享的。实际工作中有很多类库都是用 ThreadLocal 传递上下文信息的，这种场景下如果有异步操作，一定要注意上下文信息是不能跨线程共享的。</p><h2 id="多线程版本if的设计模式" tabindex="-1"><a class="header-anchor" href="#多线程版本if的设计模式"><span>多线程版本IF的设计模式</span></a></h2><p><strong>Guarded Suspension模式</strong>和<strong>Balking模式</strong>都可以简单地理解为“多线程版本的if”，但它们的区别在于前者会等待if条件变为真，而后者则不需要等待。</p><p>Guarded Suspension模式的经典实现是使用<strong>管程</strong>，很多初学者会简单地用线程sleep的方式实现，比如<a href="https://time.geekbang.org/column/article/94097" target="_blank" rel="noopener noreferrer">《31 | Guarded Suspension模式：等待唤醒机制的规范实现》</a>的思考题就是用线程sleep方式实现的。但不推荐你使用这种方式，最重要的原因是性能，如果sleep的时间太长，会影响响应时间；sleep的时间太短，会导致线程频繁地被唤醒，消耗系统资源。</p><p>同时，示例代码的实现也有问题：由于obj不是volatile变量，所以即便obj被设置了正确的值，执行 <code>while(!p.test(obj))</code> 的线程也有可能看不到，从而导致更长时间的sleep。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//获取受保护对象  </span></span>
<span class="line"><span>T get(Predicate&amp;lt;T&amp;gt; p) {</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    //obj的可见性无法保证</span></span>
<span class="line"><span>    while(!p.test(obj)){</span></span>
<span class="line"><span>      TimeUnit.SECONDS</span></span>
<span class="line"><span>        .sleep(timeout);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }catch(InterruptedException e){</span></span>
<span class="line"><span>    throw new RuntimeException(e);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //返回非空的受保护对象</span></span>
<span class="line"><span>  return obj;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//事件通知方法</span></span>
<span class="line"><span>void onChanged(T obj) {</span></span>
<span class="line"><span>  this.obj = obj;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实现Balking模式最容易忽视的就是<strong>竞态条件问题</strong>。比如，<a href="https://time.geekbang.org/column/article/94604" target="_blank" rel="noopener noreferrer">《32 | Balking模式：再谈线程安全的单例模式》</a>的思考题就存在竞态条件问题。因此，在多线程场景中使用if语句时，一定要多问自己一遍：是否存在竞态条件。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Test{</span></span>
<span class="line"><span>  volatile boolean inited = false;</span></span>
<span class="line"><span>  int count = 0;</span></span>
<span class="line"><span>  void init(){</span></span>
<span class="line"><span>    //存在竞态条件</span></span>
<span class="line"><span>    if(inited){</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //有可能多个线程执行到这里</span></span>
<span class="line"><span>    inited = true;</span></span>
<span class="line"><span>    //计算count的值</span></span>
<span class="line"><span>    count = calc();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三种最简单的分工模式" tabindex="-1"><a class="header-anchor" href="#三种最简单的分工模式"><span>三种最简单的分工模式</span></a></h2><p><strong>Thread-Per-Message模式</strong>、<strong>Worker Thread模式</strong>和<strong>生产者-消费者模式</strong>是三种<strong>最简单实用的多线程分工方法</strong>。虽说简单，但也还是有许多细节需要你多加小心和注意。</p><p>Thread-Per-Message模式在实现的时候需要注意是否存在线程的频繁创建、销毁以及是否可能导致OOM。在<a href="https://time.geekbang.org/column/article/95098" target="_blank" rel="noopener noreferrer">《33 | Thread-Per-Message模式：最简单实用的分工方法》</a>文章中，最后的思考题就是关于如何快速解决OOM问题的。在高并发场景中，最简单的办法其实是<strong>限流</strong>。当然，限流方案也并不局限于解决Thread-Per-Message模式中的OOM问题。</p><p>Worker Thread模式的实现，需要注意潜在的线程<strong>死锁问题</strong>。<a href="https://time.geekbang.org/column/article/95525" target="_blank" rel="noopener noreferrer">《34 | Worker Thread模式：如何避免重复创建线程？》</a>思考题中的示例代码就存在线程死锁。有名叫vector的同学关于这道思考题的留言，我觉得描述得很贴切和形象：“工厂里只有一个工人，他的工作就是同步地等待工厂里其他人给他提供东西，然而并没有其他人，他将等到天荒地老，海枯石烂！”因此，共享线程池虽然能够提供线程池的使用效率，但一定要保证一个前提，那就是：<strong>任务之间没有依赖关系</strong>。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ExecutorService pool = Executors</span></span>
<span class="line"><span>  .newSingleThreadExecutor();</span></span>
<span class="line"><span>//提交主任务</span></span>
<span class="line"><span>pool.submit(() -&amp;gt; {</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    //提交子任务并等待其完成，</span></span>
<span class="line"><span>    //会导致线程死锁</span></span>
<span class="line"><span>    String qq=pool.submit(()-&amp;gt;&amp;quot;QQ&amp;quot;).get();</span></span>
<span class="line"><span>    System.out.println(qq);</span></span>
<span class="line"><span>  } catch (Exception e) {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Java线程池本身就是一种生产者-消费者模式的实现，所以大部分场景你都不需要自己实现，直接使用Java的线程池就可以了。但若能自己灵活地实现生产者-消费者模式会更好，比如可以实现批量执行和分阶段提交，不过这过程中还需要注意如何优雅地终止线程，<a href="https://time.geekbang.org/column/article/96168" target="_blank" rel="noopener noreferrer">《36 | 生产者-消费者模式：用流水线思想提高效率》</a>的思考题就是关于此的。</p><p>如何优雅地终止线程？我们在<a href="https://time.geekbang.org/column/article/95847" target="_blank" rel="noopener noreferrer">《35 | 两阶段终止模式：如何优雅地终止线程？》</a>有过详细介绍，两阶段终止模式是一种通用的解决方案。但其实终止生产者-消费者服务还有一种更简单的方案，叫做**“毒丸”对象**。<a href="time://mall?url=https%3A%2F%2Fh5.youzan.com%2Fv2%2Fgoods%2F2758xqdzr6uuw" target="_blank" rel="noopener noreferrer">《Java并发编程实战》</a>第7章的7.2.3节对“毒丸”对象有过详细的介绍。简单来讲，“毒丸”对象是生产者生产的一条特殊任务，然后当消费者线程读到“毒丸”对象时，会立即终止自身的执行。</p><p>下面是用“毒丸”对象终止写日志线程的具体实现，整体的实现过程还是很简单的：类Logger中声明了一个“毒丸”对象poisonPill ，当消费者线程从阻塞队列bq中取出一条LogMsg后，先判断是否是“毒丸”对象，如果是，则break while循环，从而终止自己的执行。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Logger {</span></span>
<span class="line"><span>  //用于终止日志执行的“毒丸”</span></span>
<span class="line"><span>  final LogMsg poisonPill = </span></span>
<span class="line"><span>    new LogMsg(LEVEL.ERROR, &amp;quot;&amp;quot;);</span></span>
<span class="line"><span>  //任务队列  </span></span>
<span class="line"><span>  final BlockingQueue&amp;lt;LogMsg&amp;gt; bq</span></span>
<span class="line"><span>    = new BlockingQueue&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  //只需要一个线程写日志</span></span>
<span class="line"><span>  ExecutorService es = </span></span>
<span class="line"><span>    Executors.newFixedThreadPool(1);</span></span>
<span class="line"><span>  //启动写日志线程</span></span>
<span class="line"><span>  void start(){</span></span>
<span class="line"><span>    File file=File.createTempFile(</span></span>
<span class="line"><span>      &amp;quot;foo&amp;quot;, &amp;quot;.log&amp;quot;);</span></span>
<span class="line"><span>    final FileWriter writer=</span></span>
<span class="line"><span>      new FileWriter(file);</span></span>
<span class="line"><span>    this.es.execute(()-&amp;gt;{</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>          LogMsg log = bq.poll(</span></span>
<span class="line"><span>            5, TimeUnit.SECONDS);</span></span>
<span class="line"><span>          //如果是“毒丸”，终止执行  </span></span>
<span class="line"><span>          if(poisonPill.equals(logMsg)){</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>          }  </span></span>
<span class="line"><span>          //省略执行逻辑</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } catch(Exception e){</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>          writer.flush();</span></span>
<span class="line"><span>          writer.close();</span></span>
<span class="line"><span>        }catch(IOException e){}</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    });  </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //终止写日志线程</span></span>
<span class="line"><span>  public void stop() {</span></span>
<span class="line"><span>    //将“毒丸”对象加入阻塞队列</span></span>
<span class="line"><span>    bq.add(poisonPill);</span></span>
<span class="line"><span>    es.shutdown();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>到今天为止，“并发设计模式”模块就告一段落了，多线程的设计模式当然不止我们提到的这9种，不过这里提到的这9种设计模式一定是最简单实用的。如果感兴趣，你也可以结合《图解Java多线程设计模式》这本书来深入学习这个模块，这是一本不错的并发编程入门书籍，虽然重点是讲解设计模式，但是也详细讲解了设计模式中涉及到的方方面面的基础知识，而且深入浅出，非常推荐入门的同学认真学习一下。</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,28)]))}const d=s(l,[["render",p]]),o=JSON.parse('{"path":"/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/37%20_%20%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E6%A8%A1%E5%9D%97%E7%83%AD%E7%82%B9%E9%97%AE%E9%A2%98%E7%AD%94%E7%96%91.html","title":"","lang":"zh-CN","frontmatter":{"description":"多线程设计模式是前人解决并发问题的经验总结，当我们试图解决一个并发问题时，首选方案往往是使用匹配的设计模式，这样能避免走弯路。同时，由于大家都熟悉设计模式，所以使用设计模式还能提升方案和代码的可理解性。 在这个模块，我们总共介绍了9种常见的多线程设计模式。下面我们就对这9种设计模式做个分类和总结，同时也对前面各章的课后思考题做个答疑。 避免共享的设计模...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/37%20_%20%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E6%A8%A1%E5%9D%97%E7%83%AD%E7%82%B9%E9%97%AE%E9%A2%98%E7%AD%94%E7%96%91.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"多线程设计模式是前人解决并发问题的经验总结，当我们试图解决一个并发问题时，首选方案往往是使用匹配的设计模式，这样能避免走弯路。同时，由于大家都熟悉设计模式，所以使用设计模式还能提升方案和代码的可理解性。 在这个模块，我们总共介绍了9种常见的多线程设计模式。下面我们就对这9种设计模式做个分类和总结，同时也对前面各章的课后思考题做个答疑。 避免共享的设计模..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":7.87,"words":2362},"filePathRelative":"posts/Java并发编程实战/第三部分：并发设计模式/37 _ 设计模式模块热点问题答疑.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"37 | 设计模式模块热点问题答疑\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/18/e4/182e9c98c3f15dba1035af1defc512e4.mp3\\"></audio></p>\\n<p>多线程设计模式是前人解决并发问题的经验总结，当我们试图解决一个并发问题时，首选方案往往是使用匹配的设计模式，这样能避免走弯路。同时，由于大家都熟悉设计模式，所以使用设计模式还能提升方案和代码的可理解性。</p>","autoDesc":true}');export{d as comp,o as data};
