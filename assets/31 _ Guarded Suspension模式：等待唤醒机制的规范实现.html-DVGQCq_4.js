import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="31 | Guarded Suspension模式：等待唤醒机制的规范实现" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/20/47/20fec0307714e6780fdcee5a224c7047.mp3"></audio></p><p>前不久，同事小灰工作中遇到一个问题，他开发了一个Web项目：Web版的文件浏览器，通过它用户可以在浏览器里查看服务器上的目录和文件。这个项目依赖运维部门提供的文件浏览服务，而这个文件浏览服务只支持消息队列（MQ）方式接入。消息队列在互联网大厂中用的非常多，主要用作流量削峰和系统解耦。在这种接入方式中，发送消息和消费结果这两个操作之间是异步的，你可以参考下面的示意图来理解。</p><img src="https://static001.geekbang.org/resource/image/d1/21/d1ad5ce1df66d85698308c41e4e93a21.png" alt=""><p>在小灰的这个Web项目中，用户通过浏览器发过来一个请求，会被转换成一个异步消息发送给MQ，等MQ返回结果后，再将这个结果返回至浏览器。小灰同学的问题是：给MQ发送消息的线程是处理Web请求的线程T1，但消费MQ结果的线程并不是线程T1，那线程T1如何等待MQ的返回结果呢？为了便于你理解这个场景，我将其代码化了，示例代码如下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Message{</span></span>
<span class="line"><span>  String id;</span></span>
<span class="line"><span>  String content;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//该方法可以发送消息</span></span>
<span class="line"><span>void send(Message msg){</span></span>
<span class="line"><span>  //省略相关代码</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//MQ消息返回后会调用该方法</span></span>
<span class="line"><span>//该方法的执行线程不同于</span></span>
<span class="line"><span>//发送消息的线程</span></span>
<span class="line"><span>void onMessage(Message msg){</span></span>
<span class="line"><span>  //省略相关代码</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//处理浏览器发来的请求</span></span>
<span class="line"><span>Respond handleWebReq(){</span></span>
<span class="line"><span>  //创建一消息</span></span>
<span class="line"><span>  Message msg1 = new </span></span>
<span class="line"><span>    Message(&amp;quot;1&amp;quot;,&amp;quot;{...}&amp;quot;);</span></span>
<span class="line"><span>  //发送消息</span></span>
<span class="line"><span>  send(msg1);</span></span>
<span class="line"><span>  //如何等待MQ返回的消息呢？</span></span>
<span class="line"><span>  String result = ...;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到这里，相信你一定有点似曾相识的感觉，这不就是前面我们在<a href="https://time.geekbang.org/column/article/88487" target="_blank" rel="noopener noreferrer">《15 | Lock和Condition（下）：Dubbo如何用管程实现异步转同步？》</a>中曾介绍过的异步转同步问题吗？仔细分析，的确是这样，不过在那一篇文章中我们只是介绍了最终方案，让你知其然，但是并没有介绍这个方案是如何设计出来的，今天咱们再仔细聊聊这个问题，让你知其所以然，遇到类似问题也能自己设计出方案来。</p><h2 id="guarded-suspension模式" tabindex="-1"><a class="header-anchor" href="#guarded-suspension模式"><span>Guarded Suspension模式</span></a></h2><p>上面小灰遇到的问题，在现实世界里比比皆是，只是我们一不小心就忽略了。比如，项目组团建要外出聚餐，我们提前预订了一个包间，然后兴冲冲地奔过去，到那儿后大堂经理看了一眼包间，发现服务员正在收拾，就会告诉我们：“您预订的包间服务员正在收拾，请您稍等片刻。”过了一会，大堂经理发现包间已经收拾完了，于是马上带我们去包间就餐。</p><p>我们等待包间收拾完的这个过程和小灰遇到的等待MQ返回消息本质上是一样的，都是<strong>等待一个条件满足</strong>：就餐需要等待包间收拾完，小灰的程序里要等待MQ返回消息。</p><p>那我们来看看现实世界里是如何解决这类问题的呢？现实世界里大堂经理这个角色很重要，我们是否等待，完全是由他来协调的。通过类比，相信你也一定有思路了：我们的程序里，也需要这样一个大堂经理。的确是这样，那程序世界里的大堂经理该如何设计呢？其实设计方案前人早就搞定了，而且还将其总结成了一个设计模式：<strong>Guarded Suspension</strong>。所谓Guarded Suspension，直译过来就是“保护性地暂停”。那下面我们就来看看，Guarded Suspension模式是如何模拟大堂经理进行保护性地暂停的。</p><p>下图就是Guarded Suspension模式的结构图，非常简单，一个对象GuardedObject，内部有一个成员变量——受保护的对象，以及两个成员方法——<code>get(Predicate&amp;lt;T&amp;gt; p)</code>和<code>onChanged(T obj)</code>方法。其中，对象GuardedObject就是我们前面提到的大堂经理，受保护对象就是餐厅里面的包间；受保护对象的get()方法对应的是我们的就餐，就餐的前提条件是包间已经收拾好了，参数p就是用来描述这个前提条件的；受保护对象的onChanged()方法对应的是服务员把包间收拾好了，通过onChanged()方法可以fire一个事件，而这个事件往往能改变前提条件p的计算结果。下图中，左侧的绿色线程就是需要就餐的顾客，而右侧的蓝色线程就是收拾包间的服务员。</p><img src="https://static001.geekbang.org/resource/image/63/dc/630f3eda98a0e6a436953153c68464dc.png" alt=""><p>GuardedObject的内部实现非常简单，是管程的一个经典用法，你可以参考下面的示例代码，核心是：get()方法通过条件变量的await()方法实现等待，onChanged()方法通过条件变量的signalAll()方法实现唤醒功能。逻辑还是很简单的，所以这里就不再详细介绍了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class GuardedObject&amp;lt;T&amp;gt;{</span></span>
<span class="line"><span>  //受保护的对象</span></span>
<span class="line"><span>  T obj;</span></span>
<span class="line"><span>  final Lock lock = </span></span>
<span class="line"><span>    new ReentrantLock();</span></span>
<span class="line"><span>  final Condition done =</span></span>
<span class="line"><span>    lock.newCondition();</span></span>
<span class="line"><span>  final int timeout=1;</span></span>
<span class="line"><span>  //获取受保护对象  </span></span>
<span class="line"><span>  T get(Predicate&amp;lt;T&amp;gt; p) {</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      //MESA管程推荐写法</span></span>
<span class="line"><span>      while(!p.test(obj)){</span></span>
<span class="line"><span>        done.await(timeout, </span></span>
<span class="line"><span>          TimeUnit.SECONDS);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }catch(InterruptedException e){</span></span>
<span class="line"><span>      throw new RuntimeException(e);</span></span>
<span class="line"><span>    }finally{</span></span>
<span class="line"><span>      lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //返回非空的受保护对象</span></span>
<span class="line"><span>    return obj;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //事件通知方法</span></span>
<span class="line"><span>  void onChanged(T obj) {</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      this.obj = obj;</span></span>
<span class="line"><span>      done.signalAll();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="扩展guarded-suspension模式" tabindex="-1"><a class="header-anchor" href="#扩展guarded-suspension模式"><span>扩展Guarded Suspension模式</span></a></h2><p>上面我们介绍了Guarded Suspension模式及其实现，这个模式能够模拟现实世界里大堂经理的角色，那现在我们再来看看这个“大堂经理”能否解决小灰同学遇到的问题。</p><p>Guarded Suspension模式里GuardedObject有两个核心方法，一个是get()方法，一个是onChanged()方法。很显然，在处理Web请求的方法handleWebReq()中，可以调用GuardedObject的get()方法来实现等待；在MQ消息的消费方法onMessage()中，可以调用GuardedObject的onChanged()方法来实现唤醒。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//处理浏览器发来的请求</span></span>
<span class="line"><span>Respond handleWebReq(){</span></span>
<span class="line"><span>  //创建一消息</span></span>
<span class="line"><span>  Message msg1 = new </span></span>
<span class="line"><span>    Message(&amp;quot;1&amp;quot;,&amp;quot;{...}&amp;quot;);</span></span>
<span class="line"><span>  //发送消息</span></span>
<span class="line"><span>  send(msg1);</span></span>
<span class="line"><span>  //利用GuardedObject实现等待</span></span>
<span class="line"><span>  GuardedObject&amp;lt;Message&amp;gt; go</span></span>
<span class="line"><span>    =new GuardObjec&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  Message r = go.get(</span></span>
<span class="line"><span>    t-&amp;gt;t != null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void onMessage(Message msg){</span></span>
<span class="line"><span>  //如何找到匹配的go？</span></span>
<span class="line"><span>  GuardedObject&amp;lt;Message&amp;gt; go=???</span></span>
<span class="line"><span>  go.onChanged(msg);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是在实现的时候会遇到一个问题，handleWebReq()里面创建了GuardedObject对象的实例go，并调用其get()方等待结果，那在onMessage()方法中，如何才能够找到匹配的GuardedObject对象呢？这个过程类似服务员告诉大堂经理某某包间已经收拾好了，大堂经理如何根据包间找到就餐的人。现实世界里，大堂经理的头脑中，有包间和就餐人之间的关系图，所以服务员说完之后大堂经理立刻就能把就餐人找出来。</p><p>我们可以参考大堂经理识别就餐人的办法，来扩展一下Guarded Suspension模式，从而使它能够很方便地解决小灰同学的问题。在小灰的程序中，每个发送到MQ的消息，都有一个唯一性的属性id，所以我们可以维护一个MQ消息id和GuardedObject对象实例的关系，这个关系可以类比大堂经理大脑里维护的包间和就餐人的关系。</p><p>有了这个关系，我们来看看具体如何实现。下面的示例代码是扩展Guarded Suspension模式的实现，扩展后的GuardedObject内部维护了一个Map，其Key是MQ消息id，而Value是GuardedObject对象实例，同时增加了静态方法create()和fireEvent()；create()方法用来创建一个GuardedObject对象实例，并根据key值将其加入到Map中，而fireEvent()方法则是模拟的大堂经理根据包间找就餐人的逻辑。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class GuardedObject&amp;lt;T&amp;gt;{</span></span>
<span class="line"><span>  //受保护的对象</span></span>
<span class="line"><span>  T obj;</span></span>
<span class="line"><span>  final Lock lock = </span></span>
<span class="line"><span>    new ReentrantLock();</span></span>
<span class="line"><span>  final Condition done =</span></span>
<span class="line"><span>    lock.newCondition();</span></span>
<span class="line"><span>  final int timeout=2;</span></span>
<span class="line"><span>  //保存所有GuardedObject</span></span>
<span class="line"><span>  final static Map&amp;lt;Object, GuardedObject&amp;gt; </span></span>
<span class="line"><span>  gos=new ConcurrentHashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  //静态方法创建GuardedObject</span></span>
<span class="line"><span>  static &amp;lt;K&amp;gt; GuardedObject </span></span>
<span class="line"><span>      create(K key){</span></span>
<span class="line"><span>    GuardedObject go=new GuardedObject();</span></span>
<span class="line"><span>    gos.put(key, go);</span></span>
<span class="line"><span>    return go;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  static &amp;lt;K, T&amp;gt; void </span></span>
<span class="line"><span>      fireEvent(K key, T obj){</span></span>
<span class="line"><span>    GuardedObject go=gos.remove(key);</span></span>
<span class="line"><span>    if (go != null){</span></span>
<span class="line"><span>      go.onChanged(obj);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //获取受保护对象  </span></span>
<span class="line"><span>  T get(Predicate&amp;lt;T&amp;gt; p) {</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      //MESA管程推荐写法</span></span>
<span class="line"><span>      while(!p.test(obj)){</span></span>
<span class="line"><span>        done.await(timeout, </span></span>
<span class="line"><span>          TimeUnit.SECONDS);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }catch(InterruptedException e){</span></span>
<span class="line"><span>      throw new RuntimeException(e);</span></span>
<span class="line"><span>    }finally{</span></span>
<span class="line"><span>      lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //返回非空的受保护对象</span></span>
<span class="line"><span>    return obj;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //事件通知方法</span></span>
<span class="line"><span>  void onChanged(T obj) {</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      this.obj = obj;</span></span>
<span class="line"><span>      done.signalAll();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样利用扩展后的GuardedObject来解决小灰同学的问题就很简单了，具体代码如下所示。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//处理浏览器发来的请求</span></span>
<span class="line"><span>Respond handleWebReq(){</span></span>
<span class="line"><span>  int id=序号生成器.get();</span></span>
<span class="line"><span>  //创建一消息</span></span>
<span class="line"><span>  Message msg1 = new </span></span>
<span class="line"><span>    Message(id,&amp;quot;{...}&amp;quot;);</span></span>
<span class="line"><span>  //创建GuardedObject实例</span></span>
<span class="line"><span>  GuardedObject&amp;lt;Message&amp;gt; go=</span></span>
<span class="line"><span>    GuardedObject.create(id);  </span></span>
<span class="line"><span>  //发送消息</span></span>
<span class="line"><span>  send(msg1);</span></span>
<span class="line"><span>  //等待MQ消息</span></span>
<span class="line"><span>  Message r = go.get(</span></span>
<span class="line"><span>    t-&amp;gt;t != null);  </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>void onMessage(Message msg){</span></span>
<span class="line"><span>  //唤醒等待的线程</span></span>
<span class="line"><span>  GuardedObject.fireEvent(</span></span>
<span class="line"><span>    msg.id, msg);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>Guarded Suspension模式本质上是一种等待唤醒机制的实现，只不过Guarded Suspension模式将其规范化了。规范化的好处是你无需重头思考如何实现，也无需担心实现程序的可理解性问题，同时也能避免一不小心写出个Bug来。但Guarded Suspension模式在解决实际问题的时候，往往还是需要扩展的，扩展的方式有很多，本篇文章就直接对GuardedObject的功能进行了增强，Dubbo中DefaultFuture这个类也是采用的这种方式，你可以对比着来看，相信对DefaultFuture的实现原理会理解得更透彻。当然，你也可以创建新的类来实现对Guarded Suspension模式的扩展。</p><p>Guarded Suspension模式也常被称作Guarded Wait模式、Spin Lock模式（因为使用了while循环去等待），这些名字都很形象，不过它还有一个更形象的非官方名字：多线程版本的if。单线程场景中，if语句是不需要等待的，因为在只有一个线程的条件下，如果这个线程被阻塞，那就没有其他活动线程了，这意味着if判断条件的结果也不会发生变化了。但是多线程场景中，等待就变得有意义了，这种场景下，if判断条件的结果是可能发生变化的。所以，用“多线程版本的if”来理解这个模式会更简单。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>有同学觉得用done.await()还要加锁，太啰嗦，还不如直接使用sleep()方法，下面是他的实现，你觉得他的写法正确吗？</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//获取受保护对象  </span></span>
<span class="line"><span>T get(Predicate&amp;lt;T&amp;gt; p) {</span></span>
<span class="line"><span>  try {</span></span>
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
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。</p>`,31)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/31%20_%20Guarded%20Suspension%E6%A8%A1%E5%BC%8F%EF%BC%9A%E7%AD%89%E5%BE%85%E5%94%A4%E9%86%92%E6%9C%BA%E5%88%B6%E7%9A%84%E8%A7%84%E8%8C%83%E5%AE%9E%E7%8E%B0.html","title":"","lang":"zh-CN","frontmatter":{"description":"前不久，同事小灰工作中遇到一个问题，他开发了一个Web项目：Web版的文件浏览器，通过它用户可以在浏览器里查看服务器上的目录和文件。这个项目依赖运维部门提供的文件浏览服务，而这个文件浏览服务只支持消息队列（MQ）方式接入。消息队列在互联网大厂中用的非常多，主要用作流量削峰和系统解耦。在这种接入方式中，发送消息和消费结果这两个操作之间是异步的，你可以参考...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E9%83%A8%E5%88%86%EF%BC%9A%E5%B9%B6%E5%8F%91%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/31%20_%20Guarded%20Suspension%E6%A8%A1%E5%BC%8F%EF%BC%9A%E7%AD%89%E5%BE%85%E5%94%A4%E9%86%92%E6%9C%BA%E5%88%B6%E7%9A%84%E8%A7%84%E8%8C%83%E5%AE%9E%E7%8E%B0.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"前不久，同事小灰工作中遇到一个问题，他开发了一个Web项目：Web版的文件浏览器，通过它用户可以在浏览器里查看服务器上的目录和文件。这个项目依赖运维部门提供的文件浏览服务，而这个文件浏览服务只支持消息队列（MQ）方式接入。消息队列在互联网大厂中用的非常多，主要用作流量削峰和系统解耦。在这种接入方式中，发送消息和消费结果这两个操作之间是异步的，你可以参考..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":9.58,"words":2874},"filePathRelative":"posts/Java并发编程实战/第三部分：并发设计模式/31 _ Guarded Suspension模式：等待唤醒机制的规范实现.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"31 | Guarded Suspension模式：等待唤醒机制的规范实现\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/20/47/20fec0307714e6780fdcee5a224c7047.mp3\\"></audio></p>\\n<p>前不久，同事小灰工作中遇到一个问题，他开发了一个Web项目：Web版的文件浏览器，通过它用户可以在浏览器里查看服务器上的目录和文件。这个项目依赖运维部门提供的文件浏览服务，而这个文件浏览服务只支持消息队列（MQ）方式接入。消息队列在互联网大厂中用的非常多，主要用作流量削峰和系统解耦。在这种接入方式中，发送消息和消费结果这两个操作之间是异步的，你可以参考下面的示意图来理解。</p>","autoDesc":true}');export{t as comp,v as data};
