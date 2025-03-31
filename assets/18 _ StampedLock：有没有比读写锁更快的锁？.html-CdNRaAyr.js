import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_18-stampedlock-有没有比读写锁更快的锁" tabindex="-1"><a class="header-anchor" href="#_18-stampedlock-有没有比读写锁更快的锁"><span>18 _ StampedLock：有没有比读写锁更快的锁？</span></a></h1><p><audio id="audio" title="18 | StampedLock：有没有比读写锁更快的锁？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/7d/30/7dd89361bb5afcbcdb844e1295617730.mp3"></audio></p><p>在<a href="https://time.geekbang.org/column/article/88909" target="_blank" rel="noopener noreferrer">上一篇文章</a>中，我们介绍了读写锁，学习完之后你应该已经知道“读写锁允许多个线程同时读共享变量，适用于读多写少的场景”。那在读多写少的场景中，还有没有更快的技术方案呢？还真有，Java在1.8这个版本里，提供了一种叫StampedLock的锁，它的性能就比读写锁还要好。</p><p>下面我们就来介绍一下StampedLock的使用方法、内部工作原理以及在使用过程中需要注意的事项。</p><h2 id="stampedlock支持的三种锁模式" tabindex="-1"><a class="header-anchor" href="#stampedlock支持的三种锁模式"><span>StampedLock支持的三种锁模式</span></a></h2><p>我们先来看看在使用上StampedLock和上一篇文章讲的ReadWriteLock有哪些区别。</p><p>ReadWriteLock支持两种模式：一种是读锁，一种是写锁。而StampedLock支持三种模式，分别是：<strong>写锁</strong>、<strong>悲观读锁</strong>和<strong>乐观读</strong>。其中，写锁、悲观读锁的语义和ReadWriteLock的写锁、读锁的语义非常类似，允许多个线程同时获取悲观读锁，但是只允许一个线程获取写锁，写锁和悲观读锁是互斥的。不同的是：StampedLock里的写锁和悲观读锁加锁成功之后，都会返回一个stamp；然后解锁的时候，需要传入这个stamp。相关的示例代码如下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>final StampedLock sl = </span></span>
<span class="line"><span>  new StampedLock();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>// 获取/释放悲观读锁示意代码</span></span>
<span class="line"><span>long stamp = sl.readLock();</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  //省略业务相关代码</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  sl.unlockRead(stamp);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 获取/释放写锁示意代码</span></span>
<span class="line"><span>long stamp = sl.writeLock();</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  //省略业务相关代码</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  sl.unlockWrite(stamp);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>StampedLock的性能之所以比ReadWriteLock还要好，其关键是StampedLock支持乐观读的方式。ReadWriteLock支持多个线程同时读，但是当多个线程同时读的时候，所有的写操作会被阻塞；而StampedLock提供的乐观读，是允许一个线程获取写锁的，也就是说不是所有的写操作都被阻塞。</p><p>注意这里，我们用的是“乐观读”这个词，而不是“乐观读锁”，是要提醒你，<strong>乐观读这个操作是无锁的</strong>，所以相比较ReadWriteLock的读锁，乐观读的性能更好一些。</p><p>文中下面这段代码是出自Java SDK官方示例，并略做了修改。在distanceFromOrigin()这个方法中，首先通过调用tryOptimisticRead()获取了一个stamp，这里的tryOptimisticRead()就是我们前面提到的乐观读。之后将共享变量x和y读入方法的局部变量中，不过需要注意的是，由于tryOptimisticRead()是无锁的，所以共享变量x和y读入方法局部变量时，x和y有可能被其他线程修改了。因此最后读完之后，还需要再次验证一下是否存在写操作，这个验证操作是通过调用validate(stamp)来实现的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Point {</span></span>
<span class="line"><span>  private int x, y;</span></span>
<span class="line"><span>  final StampedLock sl = </span></span>
<span class="line"><span>    new StampedLock();</span></span>
<span class="line"><span>  //计算到原点的距离  </span></span>
<span class="line"><span>  int distanceFromOrigin() {</span></span>
<span class="line"><span>    // 乐观读</span></span>
<span class="line"><span>    long stamp = </span></span>
<span class="line"><span>      sl.tryOptimisticRead();</span></span>
<span class="line"><span>    // 读入局部变量，</span></span>
<span class="line"><span>    // 读的过程数据可能被修改</span></span>
<span class="line"><span>    int curX = x, curY = y;</span></span>
<span class="line"><span>    //判断执行读操作期间，</span></span>
<span class="line"><span>    //是否存在写操作，如果存在，</span></span>
<span class="line"><span>    //则sl.validate返回false</span></span>
<span class="line"><span>    if (!sl.validate(stamp)){</span></span>
<span class="line"><span>      // 升级为悲观读锁</span></span>
<span class="line"><span>      stamp = sl.readLock();</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        curX = x;</span></span>
<span class="line"><span>        curY = y;</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        //释放悲观读锁</span></span>
<span class="line"><span>        sl.unlockRead(stamp);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return Math.sqrt(</span></span>
<span class="line"><span>      curX * curX + curY * curY);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面这个代码示例中，如果执行乐观读操作的期间，存在写操作，会把乐观读升级为悲观读锁。这个做法挺合理的，否则你就需要在一个循环里反复执行乐观读，直到执行乐观读操作的期间没有写操作（只有这样才能保证x和y的正确性和一致性），而循环读会浪费大量的CPU。升级为悲观读锁，代码简练且不易出错，建议你在具体实践时也采用这样的方法。</p><h2 id="进一步理解乐观读" tabindex="-1"><a class="header-anchor" href="#进一步理解乐观读"><span>进一步理解乐观读</span></a></h2><p>如果你曾经用过数据库的乐观锁，可能会发现StampedLock的乐观读和数据库的乐观锁有异曲同工之妙。的确是这样的，就拿我个人来说，我是先接触的数据库里的乐观锁，然后才接触的StampedLock，我就觉得我前期数据库里乐观锁的学习对于后面理解StampedLock的乐观读有很大帮助，所以这里有必要再介绍一下数据库里的乐观锁。</p><p>还记得我第一次使用数据库乐观锁的场景是这样的：在ERP的生产模块里，会有多个人通过ERP系统提供的UI同时修改同一条生产订单，那如何保证生产订单数据是并发安全的呢？我采用的方案就是乐观锁。</p><p>乐观锁的实现很简单，在生产订单的表 product_doc 里增加了一个数值型版本号字段 version，每次更新product_doc这个表的时候，都将 version 字段加1。生产订单的UI在展示的时候，需要查询数据库，此时将这个 version 字段和其他业务字段一起返回给生产订单UI。假设用户查询的生产订单的id=777，那么SQL语句类似下面这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>select id，... ，version</span></span>
<span class="line"><span>from product_doc</span></span>
<span class="line"><span>where id=777</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用户在生产订单UI执行保存操作的时候，后台利用下面的SQL语句更新生产订单，此处我们假设该条生产订单的 version=9。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>update product_doc </span></span>
<span class="line"><span>set version=version+1，...</span></span>
<span class="line"><span>where id=777 and version=9</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果这条SQL语句执行成功并且返回的条数等于1，那么说明从生产订单UI执行查询操作到执行保存操作期间，没有其他人修改过这条数据。因为如果这期间其他人修改过这条数据，那么版本号字段一定会大于9。</p><p>你会发现数据库里的乐观锁，查询的时候需要把 version 字段查出来，更新的时候要利用 version 字段做验证。这个 version 字段就类似于StampedLock里面的stamp。这样对比着看，相信你会更容易理解StampedLock里乐观读的用法。</p><h2 id="stampedlock使用注意事项" tabindex="-1"><a class="header-anchor" href="#stampedlock使用注意事项"><span>StampedLock使用注意事项</span></a></h2><p>对于读多写少的场景StampedLock性能很好，简单的应用场景基本上可以替代ReadWriteLock，但是<strong>StampedLock的功能仅仅是ReadWriteLock的子集</strong>，在使用的时候，还是有几个地方需要注意一下。</p><p>StampedLock在命名上并没有增加Reentrant，想必你已经猜测到StampedLock应该是不可重入的。事实上，的确是这样的，<strong>StampedLock不支持重入</strong>。这个是在使用中必须要特别注意的。</p><p>另外，StampedLock的悲观读锁、写锁都不支持条件变量，这个也需要你注意。</p><p>还有一点需要特别注意，那就是：如果线程阻塞在StampedLock的readLock()或者writeLock()上时，此时调用该阻塞线程的interrupt()方法，会导致CPU飙升。例如下面的代码中，线程T1获取写锁之后将自己阻塞，线程T2尝试获取悲观读锁，也会阻塞；如果此时调用线程T2的interrupt()方法来中断线程T2的话，你会发现线程T2所在CPU会飙升到100%。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>final StampedLock lock</span></span>
<span class="line"><span>  = new StampedLock();</span></span>
<span class="line"><span>Thread T1 = new Thread(()-&amp;gt;{</span></span>
<span class="line"><span>  // 获取写锁</span></span>
<span class="line"><span>  lock.writeLock();</span></span>
<span class="line"><span>  // 永远阻塞在此处，不释放写锁</span></span>
<span class="line"><span>  LockSupport.park();</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>T1.start();</span></span>
<span class="line"><span>// 保证T1获取写锁</span></span>
<span class="line"><span>Thread.sleep(100);</span></span>
<span class="line"><span>Thread T2 = new Thread(()-&amp;gt;</span></span>
<span class="line"><span>  //阻塞在悲观读锁</span></span>
<span class="line"><span>  lock.readLock()</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>T2.start();</span></span>
<span class="line"><span>// 保证T2阻塞在读锁</span></span>
<span class="line"><span>Thread.sleep(100);</span></span>
<span class="line"><span>//中断线程T2</span></span>
<span class="line"><span>//会导致线程T2所在CPU飙升</span></span>
<span class="line"><span>T2.interrupt();</span></span>
<span class="line"><span>T2.join();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，<strong>使用StampedLock一定不要调用中断操作，如果需要支持中断功能，一定使用可中断的悲观读锁readLockInterruptibly()和写锁writeLockInterruptibly()</strong>。这个规则一定要记清楚。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>StampedLock的使用看上去有点复杂，但是如果你能理解乐观锁背后的原理，使用起来还是比较流畅的。建议你认真揣摩Java的官方示例，这个示例基本上就是一个最佳实践。我们把Java官方示例精简后，形成下面的代码模板，建议你在实际工作中尽量按照这个模板来使用StampedLock。</p><p>StampedLock读模板：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>final StampedLock sl = </span></span>
<span class="line"><span>  new StampedLock();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 乐观读</span></span>
<span class="line"><span>long stamp = </span></span>
<span class="line"><span>  sl.tryOptimisticRead();</span></span>
<span class="line"><span>// 读入方法局部变量</span></span>
<span class="line"><span>......</span></span>
<span class="line"><span>// 校验stamp</span></span>
<span class="line"><span>if (!sl.validate(stamp)){</span></span>
<span class="line"><span>  // 升级为悲观读锁</span></span>
<span class="line"><span>  stamp = sl.readLock();</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    // 读入方法局部变量</span></span>
<span class="line"><span>    .....</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    //释放悲观读锁</span></span>
<span class="line"><span>    sl.unlockRead(stamp);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//使用方法局部变量执行业务操作</span></span>
<span class="line"><span>......</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>StampedLock写模板：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>long stamp = sl.writeLock();</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  // 写共享变量</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>} finally {</span></span>
<span class="line"><span>  sl.unlockWrite(stamp);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>StampedLock支持锁的降级（通过tryConvertToReadLock()方法实现）和升级（通过tryConvertToWriteLock()方法实现），但是建议你要慎重使用。下面的代码也源自Java的官方示例，我仅仅做了一点修改，隐藏了一个Bug，你来看看Bug出在哪里吧。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>private double x, y;</span></span>
<span class="line"><span>final StampedLock sl = new StampedLock();</span></span>
<span class="line"><span>// 存在问题的方法</span></span>
<span class="line"><span>void moveIfAtOrigin(double newX, double newY){</span></span>
<span class="line"><span> long stamp = sl.readLock();</span></span>
<span class="line"><span> try {</span></span>
<span class="line"><span>  while(x == 0.0 &amp;amp;&amp;amp; y == 0.0){</span></span>
<span class="line"><span>    long ws = sl.tryConvertToWriteLock(stamp);</span></span>
<span class="line"><span>    if (ws != 0L) {</span></span>
<span class="line"><span>      x = newX;</span></span>
<span class="line"><span>      y = newY;</span></span>
<span class="line"><span>      break;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      sl.unlockRead(stamp);</span></span>
<span class="line"><span>      stamp = sl.writeLock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> } finally {</span></span>
<span class="line"><span>  sl.unlock(stamp);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,39)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB/18%20_%20StampedLock%EF%BC%9A%E6%9C%89%E6%B2%A1%E6%9C%89%E6%AF%94%E8%AF%BB%E5%86%99%E9%94%81%E6%9B%B4%E5%BF%AB%E7%9A%84%E9%94%81%EF%BC%9F.html","title":"18 _ StampedLock：有没有比读写锁更快的锁？","lang":"zh-CN","frontmatter":{"description":"18 _ StampedLock：有没有比读写锁更快的锁？ 在上一篇文章中，我们介绍了读写锁，学习完之后你应该已经知道“读写锁允许多个线程同时读共享变量，适用于读多写少的场景”。那在读多写少的场景中，还有没有更快的技术方案呢？还真有，Java在1.8这个版本里，提供了一种叫StampedLock的锁，它的性能就比读写锁还要好。 下面我们就来介绍一下St...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB/18%20_%20StampedLock%EF%BC%9A%E6%9C%89%E6%B2%A1%E6%9C%89%E6%AF%94%E8%AF%BB%E5%86%99%E9%94%81%E6%9B%B4%E5%BF%AB%E7%9A%84%E9%94%81%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"18 _ StampedLock：有没有比读写锁更快的锁？"}],["meta",{"property":"og:description","content":"18 _ StampedLock：有没有比读写锁更快的锁？ 在上一篇文章中，我们介绍了读写锁，学习完之后你应该已经知道“读写锁允许多个线程同时读共享变量，适用于读多写少的场景”。那在读多写少的场景中，还有没有更快的技术方案呢？还真有，Java在1.8这个版本里，提供了一种叫StampedLock的锁，它的性能就比读写锁还要好。 下面我们就来介绍一下St..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"18 _ StampedLock：有没有比读写锁更快的锁？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":7.99,"words":2398},"filePathRelative":"posts/Java并发编程实战/第二部分：并发工具类/18 _ StampedLock：有没有比读写锁更快的锁？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"18 | StampedLock：有没有比读写锁更快的锁？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/7d/30/7dd89361bb5afcbcdb844e1295617730.mp3\\"></audio></p>\\n<p>在<a href=\\"https://time.geekbang.org/column/article/88909\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">上一篇文章</a>中，我们介绍了读写锁，学习完之后你应该已经知道“读写锁允许多个线程同时读共享变量，适用于读多写少的场景”。那在读多写少的场景中，还有没有更快的技术方案呢？还真有，Java在1.8这个版本里，提供了一种叫StampedLock的锁，它的性能就比读写锁还要好。</p>","autoDesc":true}');export{t as comp,v as data};
