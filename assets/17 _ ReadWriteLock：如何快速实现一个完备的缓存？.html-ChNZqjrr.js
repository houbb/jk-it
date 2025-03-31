import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(c,n){return e(),a("div",null,n[0]||(n[0]=[i(`<p><audio id="audio" title="17 | ReadWriteLock：如何快速实现一个完备的缓存？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/9a/0b/9ad06e966d88f117f54665f266c7640b.mp3"></audio></p><p>前面我们介绍了管程和信号量这两个同步原语在Java语言中的实现，理论上用这两个同步原语中任何一个都可以解决所有的并发问题。那Java SDK并发包里为什么还有很多其他的工具类呢？原因很简单：<strong>分场景优化性能，提升易用性</strong>。</p><p>今天我们就介绍一种非常普遍的并发场景：读多写少场景。实际工作中，为了优化性能，我们经常会使用缓存，例如缓存元数据、缓存基础数据等，这就是一种典型的读多写少应用场景。缓存之所以能提升性能，一个重要的条件就是缓存的数据一定是读多写少的，例如元数据和基础数据基本上不会发生变化（写少），但是使用它们的地方却很多（读多）。</p><p>针对读多写少这种并发场景，Java SDK并发包提供了读写锁——ReadWriteLock，非常容易使用，并且性能很好。</p><p><strong>那什么是读写锁呢？</strong></p><p>读写锁，并不是Java语言特有的，而是一个广为使用的通用技术，所有的读写锁都遵守以下三条基本原则：</p><ol><li>允许多个线程同时读共享变量；</li><li>只允许一个线程写共享变量；</li><li>如果一个写线程正在执行写操作，此时禁止读线程读共享变量。</li></ol><p>读写锁与互斥锁的一个重要区别就是<strong>读写锁允许多个线程同时读共享变量</strong>，而互斥锁是不允许的，这是读写锁在读多写少场景下性能优于互斥锁的关键。但<strong>读写锁的写操作是互斥的</strong>，当一个线程在写共享变量的时候，是不允许其他线程执行写操作和读操作。</p><h2 id="快速实现一个缓存" tabindex="-1"><a class="header-anchor" href="#快速实现一个缓存"><span>快速实现一个缓存</span></a></h2><p>下面我们就实践起来，用ReadWriteLock快速实现一个通用的缓存工具类。</p><p>在下面的代码中，我们声明了一个Cache&lt;K, V&gt;类，其中类型参数K代表缓存里key的类型，V代表缓存里value的类型。缓存的数据保存在Cache类内部的HashMap里面，HashMap不是线程安全的，这里我们使用读写锁ReadWriteLock 来保证其线程安全。ReadWriteLock 是一个接口，它的实现类是ReentrantReadWriteLock，通过名字你应该就能判断出来，它是支持可重入的。下面我们通过rwl创建了一把读锁和一把写锁。</p><p>Cache这个工具类，我们提供了两个方法，一个是读缓存方法get()，另一个是写缓存方法put()。读缓存需要用到读锁，读锁的使用和前面我们介绍的Lock的使用是相同的，都是try{}finally{}这个编程范式。写缓存则需要用到写锁，写锁的使用和读锁是类似的。这样看来，读写锁的使用还是非常简单的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Cache&amp;lt;K,V&amp;gt; {</span></span>
<span class="line"><span>  final Map&amp;lt;K, V&amp;gt; m =</span></span>
<span class="line"><span>    new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  final ReadWriteLock rwl =</span></span>
<span class="line"><span>    new ReentrantReadWriteLock();</span></span>
<span class="line"><span>  // 读锁</span></span>
<span class="line"><span>  final Lock r = rwl.readLock();</span></span>
<span class="line"><span>  // 写锁</span></span>
<span class="line"><span>  final Lock w = rwl.writeLock();</span></span>
<span class="line"><span>  // 读缓存</span></span>
<span class="line"><span>  V get(K key) {</span></span>
<span class="line"><span>    r.lock();</span></span>
<span class="line"><span>    try { return m.get(key); }</span></span>
<span class="line"><span>    finally { r.unlock(); }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 写缓存</span></span>
<span class="line"><span>  V put(K key, V value) {</span></span>
<span class="line"><span>    w.lock();</span></span>
<span class="line"><span>    try { return m.put(key, v); }</span></span>
<span class="line"><span>    finally { w.unlock(); }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你曾经使用过缓存的话，你应该知道<strong>使用缓存首先要解决缓存数据的初始化问题</strong>。缓存数据的初始化，可以采用一次性加载的方式，也可以使用按需加载的方式。</p><p>如果源头数据的数据量不大，就可以采用一次性加载的方式，这种方式最简单（可参考下图），只需在应用启动的时候把源头数据查询出来，依次调用类似上面示例代码中的put()方法就可以了。</p><img src="https://static001.geekbang.org/resource/image/62/1e/627be6e80f96719234007d0a6426771e.png" alt=""><p>如果源头数据量非常大，那么就需要按需加载了，按需加载也叫懒加载，指的是只有当应用查询缓存，并且数据不在缓存里的时候，才触发加载源头相关数据进缓存的操作。下面你可以结合文中示意图看看如何利用ReadWriteLock 来实现缓存的按需加载。</p><img src="https://static001.geekbang.org/resource/image/4e/73/4e036a6b38244accfb74a0d18300f073.png" alt=""><h2 id="实现缓存的按需加载" tabindex="-1"><a class="header-anchor" href="#实现缓存的按需加载"><span>实现缓存的按需加载</span></a></h2><p>文中下面的这段代码实现了按需加载的功能，这里我们假设缓存的源头是数据库。需要注意的是，如果缓存中没有缓存目标对象，那么就需要从数据库中加载，然后写入缓存，写缓存需要用到写锁，所以在代码中的⑤处，我们调用了 <code>w.lock()</code> 来获取写锁。</p><p>另外，还需要注意的是，在获取写锁之后，我们并没有直接去查询数据库，而是在代码⑥⑦处，重新验证了一次缓存中是否存在，再次验证如果还是不存在，我们才去查询数据库并更新本地缓存。为什么我们要再次验证呢？</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Cache&amp;lt;K,V&amp;gt; {</span></span>
<span class="line"><span>  final Map&amp;lt;K, V&amp;gt; m =</span></span>
<span class="line"><span>    new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  final ReadWriteLock rwl = </span></span>
<span class="line"><span>    new ReentrantReadWriteLock();</span></span>
<span class="line"><span>  final Lock r = rwl.readLock();</span></span>
<span class="line"><span>  final Lock w = rwl.writeLock();</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  V get(K key) {</span></span>
<span class="line"><span>    V v = null;</span></span>
<span class="line"><span>    //读缓存</span></span>
<span class="line"><span>    r.lock();         ①</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      v = m.get(key); ②</span></span>
<span class="line"><span>    } finally{</span></span>
<span class="line"><span>      r.unlock();     ③</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //缓存中存在，返回</span></span>
<span class="line"><span>    if(v != null) {   ④</span></span>
<span class="line"><span>      return v;</span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    //缓存中不存在，查询数据库</span></span>
<span class="line"><span>    w.lock();         ⑤</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      //再次验证</span></span>
<span class="line"><span>      //其他线程可能已经查询过数据库</span></span>
<span class="line"><span>      v = m.get(key); ⑥</span></span>
<span class="line"><span>      if(v == null){  ⑦</span></span>
<span class="line"><span>        //查询数据库</span></span>
<span class="line"><span>        v=省略代码无数</span></span>
<span class="line"><span>        m.put(key, v);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } finally{</span></span>
<span class="line"><span>      w.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return v; </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原因是在高并发的场景下，有可能会有多线程竞争写锁。假设缓存是空的，没有缓存任何东西，如果此时有三个线程T1、T2和T3同时调用get()方法，并且参数key也是相同的。那么它们会同时执行到代码⑤处，但此时只有一个线程能够获得写锁，假设是线程T1，线程T1获取写锁之后查询数据库并更新缓存，最终释放写锁。此时线程T2和T3会再有一个线程能够获取写锁，假设是T2，如果不采用再次验证的方式，此时T2会再次查询数据库。T2释放写锁之后，T3也会再次查询一次数据库。而实际上线程T1已经把缓存的值设置好了，T2、T3完全没有必要再次查询数据库。所以，再次验证的方式，能够避免高并发场景下重复查询数据的问题。</p><h2 id="读写锁的升级与降级" tabindex="-1"><a class="header-anchor" href="#读写锁的升级与降级"><span>读写锁的升级与降级</span></a></h2><p>上面按需加载的示例代码中，在①处获取读锁，在③处释放读锁，那是否可以在②处的下面增加验证缓存并更新缓存的逻辑呢？详细的代码如下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//读缓存</span></span>
<span class="line"><span>r.lock();         ①</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  v = m.get(key); ②</span></span>
<span class="line"><span>  if (v == null) {</span></span>
<span class="line"><span>    w.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      //再次验证并更新缓存</span></span>
<span class="line"><span>      //省略详细代码</span></span>
<span class="line"><span>    } finally{</span></span>
<span class="line"><span>      w.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>} finally{</span></span>
<span class="line"><span>  r.unlock();     ③</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样看上去好像是没有问题的，先是获取读锁，然后再升级为写锁，对此还有个专业的名字，叫<strong>锁的升级</strong>。可惜ReadWriteLock并不支持这种升级。在上面的代码示例中，读锁还没有释放，此时获取写锁，会导致写锁永久等待，最终导致相关线程都被阻塞，永远也没有机会被唤醒。锁的升级是不允许的，这个你一定要注意。</p><p>不过，虽然锁的升级是不允许的，但是锁的降级却是允许的。以下代码来源自ReentrantReadWriteLock的官方示例，略做了改动。你会发现在代码①处，获取读锁的时候线程还是持有写锁的，这种锁的降级是支持的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class CachedData {</span></span>
<span class="line"><span>  Object data;</span></span>
<span class="line"><span>  volatile boolean cacheValid;</span></span>
<span class="line"><span>  final ReadWriteLock rwl =</span></span>
<span class="line"><span>    new ReentrantReadWriteLock();</span></span>
<span class="line"><span>  // 读锁  </span></span>
<span class="line"><span>  final Lock r = rwl.readLock();</span></span>
<span class="line"><span>  //写锁</span></span>
<span class="line"><span>  final Lock w = rwl.writeLock();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  void processCachedData() {</span></span>
<span class="line"><span>    // 获取读锁</span></span>
<span class="line"><span>    r.lock();</span></span>
<span class="line"><span>    if (!cacheValid) {</span></span>
<span class="line"><span>      // 释放读锁，因为不允许读锁的升级</span></span>
<span class="line"><span>      r.unlock();</span></span>
<span class="line"><span>      // 获取写锁</span></span>
<span class="line"><span>      w.lock();</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        // 再次检查状态  </span></span>
<span class="line"><span>        if (!cacheValid) {</span></span>
<span class="line"><span>          data = ...</span></span>
<span class="line"><span>          cacheValid = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 释放写锁前，降级为读锁</span></span>
<span class="line"><span>        // 降级是可以的</span></span>
<span class="line"><span>        r.lock(); ①</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        // 释放写锁</span></span>
<span class="line"><span>        w.unlock(); </span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 此处仍然持有读锁</span></span>
<span class="line"><span>    try {use(data);} </span></span>
<span class="line"><span>    finally {r.unlock();}</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>读写锁类似于ReentrantLock，也支持公平模式和非公平模式。读锁和写锁都实现了 java.util.concurrent.locks.Lock接口，所以除了支持lock()方法外，tryLock()、lockInterruptibly() 等方法也都是支持的。但是有一点需要注意，那就是只有写锁支持条件变量，读锁是不支持条件变量的，读锁调用newCondition()会抛出UnsupportedOperationException异常。</p><p>今天我们用ReadWriteLock实现了一个简单的缓存，这个缓存虽然解决了缓存的初始化问题，但是没有解决缓存数据与源头数据的同步问题，这里的数据同步指的是保证缓存数据和源头数据的一致性。解决数据同步问题的一个最简单的方案就是<strong>超时机制</strong>。所谓超时机制指的是加载进缓存的数据不是长久有效的，而是有时效的，当缓存的数据超过时效，也就是超时之后，这条数据在缓存中就失效了。而访问缓存中失效的数据，会触发缓存重新从源头把数据加载进缓存。</p><p>当然也可以在源头数据发生变化时，快速反馈给缓存，但这个就要依赖具体的场景了。例如MySQL作为数据源头，可以通过近实时地解析binlog来识别数据是否发生了变化，如果发生了变化就将最新的数据推送给缓存。另外，还有一些方案采取的是数据库和缓存的双写方案。</p><p>总之，具体采用哪种方案，还是要看应用的场景。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>有同学反映线上系统停止响应了，CPU利用率很低，你怀疑有同学一不小心写出了读锁升级写锁的方案，那你该如何验证自己的怀疑呢？</p><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,37)]))}const t=s(l,[["render",p]]),v=JSON.parse('{"path":"/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB/17%20_%20ReadWriteLock%EF%BC%9A%E5%A6%82%E4%BD%95%E5%BF%AB%E9%80%9F%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%AE%8C%E5%A4%87%E7%9A%84%E7%BC%93%E5%AD%98%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"前面我们介绍了管程和信号量这两个同步原语在Java语言中的实现，理论上用这两个同步原语中任何一个都可以解决所有的并发问题。那Java SDK并发包里为什么还有很多其他的工具类呢？原因很简单：分场景优化性能，提升易用性。 今天我们就介绍一种非常普遍的并发场景：读多写少场景。实际工作中，为了优化性能，我们经常会使用缓存，例如缓存元数据、缓存基础数据等，这就...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB/17%20_%20ReadWriteLock%EF%BC%9A%E5%A6%82%E4%BD%95%E5%BF%AB%E9%80%9F%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E5%AE%8C%E5%A4%87%E7%9A%84%E7%BC%93%E5%AD%98%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"前面我们介绍了管程和信号量这两个同步原语在Java语言中的实现，理论上用这两个同步原语中任何一个都可以解决所有的并发问题。那Java SDK并发包里为什么还有很多其他的工具类呢？原因很简单：分场景优化性能，提升易用性。 今天我们就介绍一种非常普遍的并发场景：读多写少场景。实际工作中，为了优化性能，我们经常会使用缓存，例如缓存元数据、缓存基础数据等，这就..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":8.8,"words":2640},"filePathRelative":"posts/Java并发编程实战/第二部分：并发工具类/17 _ ReadWriteLock：如何快速实现一个完备的缓存？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"17 | ReadWriteLock：如何快速实现一个完备的缓存？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/9a/0b/9ad06e966d88f117f54665f266c7640b.mp3\\"></audio></p>\\n<p>前面我们介绍了管程和信号量这两个同步原语在Java语言中的实现，理论上用这两个同步原语中任何一个都可以解决所有的并发问题。那Java SDK并发包里为什么还有很多其他的工具类呢？原因很简单：<strong>分场景优化性能，提升易用性</strong>。</p>","autoDesc":true}');export{t as comp,v as data};
