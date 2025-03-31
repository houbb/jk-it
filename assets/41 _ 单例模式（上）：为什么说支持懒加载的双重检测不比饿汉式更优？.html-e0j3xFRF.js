import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const l={};function p(r,n){return i(),a("div",null,n[0]||(n[0]=[e(`<p><audio id="audio" title="41 | 单例模式（上）：为什么说支持懒加载的双重检测不比饿汉式更优？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/c0/5b/c040683ccf363d91563d018ad7f7715b.mp3"></audio></p><p>从今天开始，我们正式进入到设计模式的学习。我们知道，经典的设计模式有23种。其中，常用的并不是很多。据我的工作经验来看，常用的可能都不到一半。如果随便抓一个程序员，让他说一说最熟悉的3种设计模式，那其中肯定会包含今天要讲的单例模式。</p><p>网上有很多讲解单例模式的文章，但大部分都侧重讲解，如何来实现一个线程安全的单例。我今天也会讲到各种单例的实现方法，但是，这并不是我们专栏学习的重点，我重点还是希望带你搞清楚下面这样几个问题（第一个问题会在今天讲解，后面三个问题放到下一节课中讲解）。</p><ul><li>为什么要使用单例？</li><li>单例存在哪些问题？</li><li>单例与静态类的区别？</li><li>有何替代的解决方案？</li></ul><p>话不多说，让我们带着这些问题，正式开始今天的学习吧！</p><h2 id="为什么要使用单例" tabindex="-1"><a class="header-anchor" href="#为什么要使用单例"><span>为什么要使用单例？</span></a></h2><p><strong>单例设计模式</strong>（Singleton Design Pattern）理解起来非常简单。一个类只允许创建一个对象（或者实例），那这个类就是一个单例类，这种设计模式就叫作单例设计模式，简称单例模式。</p><p>对于单例的概念，我觉得没必要解释太多，你一看就能明白。我们重点看一下，为什么我们需要单例这种设计模式？它能解决哪些问题？接下来我通过两个实战案例来讲解。</p><h3 id="实战案例一-处理资源访问冲突" tabindex="-1"><a class="header-anchor" href="#实战案例一-处理资源访问冲突"><span>实战案例一：处理资源访问冲突</span></a></h3><p>我们先来看第一个例子。在这个例子中，我们自定义实现了一个往文件中打印日志的Logger类。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Logger {</span></span>
<span class="line"><span>  private FileWriter writer;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public Logger() {</span></span>
<span class="line"><span>    File file = new File(&amp;quot;/Users/wangzheng/log.txt&amp;quot;);</span></span>
<span class="line"><span>    writer = new FileWriter(file, true); //true表示追加写入</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void log(String message) {</span></span>
<span class="line"><span>    writer.write(mesasge);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Logger类的应用示例：</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span>  private Logger logger = new Logger();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void login(String username, String password) {</span></span>
<span class="line"><span>    // ...省略业务逻辑代码...</span></span>
<span class="line"><span>    logger.log(username + &amp;quot; logined!&amp;quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class OrderController {</span></span>
<span class="line"><span>  private Logger logger = new Logger();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void create(OrderVo order) {</span></span>
<span class="line"><span>    // ...省略业务逻辑代码...</span></span>
<span class="line"><span>    logger.log(&amp;quot;Created an order: &amp;quot; + order.toString());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看完代码之后，先别着急看我下面的讲解，你可以先思考一下，这段代码存在什么问题。</p><p>在上面的代码中，我们注意到，所有的日志都写入到同一个文件/Users/wangzheng/log.txt中。在UserController和OrderController中，我们分别创建两个Logger对象。在Web容器的Servlet多线程环境下，如果两个Servlet线程同时分别执行login()和create()两个函数，并且同时写日志到log.txt文件中，那就有可能存在日志信息互相覆盖的情况。</p><p>为什么会出现互相覆盖呢？我们可以这么类比着理解。在多线程环境下，如果两个线程同时给同一个共享变量加1，因为共享变量是竞争资源，所以，共享变量最后的结果有可能并不是加了2，而是只加了1。同理，这里的log.txt文件也是竞争资源，两个线程同时往里面写数据，就有可能存在互相覆盖的情况。</p><img src="https://static001.geekbang.org/resource/image/2b/c2/2b0e6141d10399430c59169af4edc3c2.jpg" alt=""><p>那如何来解决这个问题呢？我们最先想到的就是通过加锁的方式：给log()函数加互斥锁（Java中可以通过synchronized的关键字），同一时刻只允许一个线程调用执行log()函数。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Logger {</span></span>
<span class="line"><span>  private FileWriter writer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Logger() {</span></span>
<span class="line"><span>    File file = new File(&amp;quot;/Users/wangzheng/log.txt&amp;quot;);</span></span>
<span class="line"><span>    writer = new FileWriter(file, true); //true表示追加写入</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void log(String message) {</span></span>
<span class="line"><span>    synchronized(this) {</span></span>
<span class="line"><span>      writer.write(mesasge);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过，你仔细想想，这真的能解决多线程写入日志时互相覆盖的问题吗？答案是否定的。这是因为，这种锁是一个对象级别的锁，一个对象在不同的线程下同时调用log()函数，会被强制要求顺序执行。但是，不同的对象之间并不共享同一把锁。在不同的线程下，通过不同的对象调用执行log()函数，锁并不会起作用，仍然有可能存在写入日志互相覆盖的问题。</p><img src="https://static001.geekbang.org/resource/image/20/29/203eb5070c3820b48500d4ab95732f29.jpg" alt=""><p>我这里稍微补充一下，在刚刚的讲解和给出的代码中，我故意“隐瞒”了一个事实：我们给log()函数加不加对象级别的锁，其实都没有关系。因为FileWriter本身就是线程安全的，它的内部实现中本身就加了对象级别的锁，因此，在外层调用write()函数的时候，再加对象级别的锁实际上是多此一举。因为不同的Logger对象不共享FileWriter对象，所以，FileWriter对象级别的锁也解决不了数据写入互相覆盖的问题。</p><p>那我们该怎么解决这个问题呢？实际上，要想解决这个问题也不难，我们只需要把对象级别的锁，换成类级别的锁就可以了。让所有的对象都共享同一把锁。这样就避免了不同对象之间同时调用log()函数，而导致的日志覆盖问题。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Logger {</span></span>
<span class="line"><span>  private FileWriter writer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Logger() {</span></span>
<span class="line"><span>    File file = new File(&amp;quot;/Users/wangzheng/log.txt&amp;quot;);</span></span>
<span class="line"><span>    writer = new FileWriter(file, true); //true表示追加写入</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void log(String message) {</span></span>
<span class="line"><span>    synchronized(Logger.class) { // 类级别的锁</span></span>
<span class="line"><span>      writer.write(mesasge);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了使用类级别锁之外，实际上，解决资源竞争问题的办法还有很多，分布式锁是最常听到的一种解决方案。不过，实现一个安全可靠、无bug、高性能的分布式锁，并不是件容易的事情。除此之外，并发队列（比如Java中的BlockingQueue）也可以解决这个问题：多个线程同时往并发队列里写日志，一个单独的线程负责将并发队列中的数据，写入到日志文件。这种方式实现起来也稍微有点复杂。</p><p>相对于这两种解决方案，单例模式的解决思路就简单一些了。单例模式相对于之前类级别锁的好处是，不用创建那么多Logger对象，一方面节省内存空间，另一方面节省系统文件句柄（对于操作系统来说，文件句柄也是一种资源，不能随便浪费）。</p><p>我们将Logger设计成一个单例类，程序中只允许创建一个Logger对象，所有的线程共享使用的这一个Logger对象，共享一个FileWriter对象，而FileWriter本身是对象级别线程安全的，也就避免了多线程情况下写日志会互相覆盖的问题。</p><p>按照这个设计思路，我们实现了Logger单例类。具体代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Logger {</span></span>
<span class="line"><span>  private FileWriter writer;</span></span>
<span class="line"><span>  private static final Logger instance = new Logger();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private Logger() {</span></span>
<span class="line"><span>    File file = new File(&amp;quot;/Users/wangzheng/log.txt&amp;quot;);</span></span>
<span class="line"><span>    writer = new FileWriter(file, true); //true表示追加写入</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public static Logger getInstance() {</span></span>
<span class="line"><span>    return instance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void log(String message) {</span></span>
<span class="line"><span>    writer.write(mesasge);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Logger类的应用示例：</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span>  public void login(String username, String password) {</span></span>
<span class="line"><span>    // ...省略业务逻辑代码...</span></span>
<span class="line"><span>    Logger.getInstance().log(username + &amp;quot; logined!&amp;quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class OrderController {  </span></span>
<span class="line"><span>  public void create(OrderVo order) {</span></span>
<span class="line"><span>    // ...省略业务逻辑代码...</span></span>
<span class="line"><span>    Logger.getInstance().log(&amp;quot;Created a order: &amp;quot; + order.toString());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实战案例二-表示全局唯一类" tabindex="-1"><a class="header-anchor" href="#实战案例二-表示全局唯一类"><span>实战案例二：表示全局唯一类</span></a></h3><p>从业务概念上，如果有些数据在系统中只应保存一份，那就比较适合设计为单例类。</p><p>比如，配置信息类。在系统中，我们只有一个配置文件，当配置文件被加载到内存之后，以对象的形式存在，也理所应当只有一份。</p><p>再比如，唯一递增ID号码生成器（<a href="https://time.geekbang.org/column/article/190979" target="_blank" rel="noopener noreferrer">第34讲</a>中我们讲的是唯一ID生成器，这里讲的是唯一递增ID生成器），如果程序中有两个对象，那就会存在生成重复ID的情况，所以，我们应该将ID生成器类设计为单例。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import java.util.concurrent.atomic.AtomicLong;</span></span>
<span class="line"><span>public class IdGenerator {</span></span>
<span class="line"><span>  // AtomicLong是一个Java并发库中提供的一个原子变量类型,</span></span>
<span class="line"><span>  // 它将一些线程不安全需要加锁的复合操作封装为了线程安全的原子操作，</span></span>
<span class="line"><span>  // 比如下面会用到的incrementAndGet().</span></span>
<span class="line"><span>  private AtomicLong id = new AtomicLong(0);</span></span>
<span class="line"><span>  private static final IdGenerator instance = new IdGenerator();</span></span>
<span class="line"><span>  private IdGenerator() {}</span></span>
<span class="line"><span>  public static IdGenerator getInstance() {</span></span>
<span class="line"><span>    return instance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public long getId() { </span></span>
<span class="line"><span>    return id.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// IdGenerator使用举例</span></span>
<span class="line"><span>long id = IdGenerator.getInstance().getId();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，今天讲到的两个代码实例（Logger、IdGenerator），设计的都并不优雅，还存在一些问题。至于有什么问题以及如何改造，今天我暂时卖个关子，下一节课我会详细讲解。</p><h2 id="如何实现一个单例" tabindex="-1"><a class="header-anchor" href="#如何实现一个单例"><span>如何实现一个单例？</span></a></h2><p>尽管介绍如何实现一个单例模式的文章已经有很多了，但为了保证内容的完整性，我这里还是简单介绍一下几种经典实现方式。概括起来，要实现一个单例，我们需要关注的点无外乎下面几个：</p><ul><li>构造函数需要是private访问权限的，这样才能避免外部通过new创建实例；</li><li>考虑对象创建时的线程安全问题；</li><li>考虑是否支持延迟加载；</li><li>考虑getInstance()性能是否高（是否加锁）。</li></ul><p>如果你对这块已经很熟悉了，你可以当作复习。注意，下面的几种单例实现方式是针对Java语言语法的，如果你熟悉的是其他语言，不妨对比Java的这几种实现方式，自己试着总结一下，利用你熟悉的语言，该如何实现。</p><h3 id="_1-饿汉式" tabindex="-1"><a class="header-anchor" href="#_1-饿汉式"><span>1.饿汉式</span></a></h3><p>饿汉式的实现方式比较简单。在类加载的时候，instance静态实例就已经创建并初始化好了，所以，instance实例的创建过程是线程安全的。不过，这样的实现方式不支持延迟加载（在真正用到IdGenerator的时候，再创建实例），从名字中我们也可以看出这一点。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class IdGenerator { </span></span>
<span class="line"><span>  private AtomicLong id = new AtomicLong(0);</span></span>
<span class="line"><span>  private static final IdGenerator instance = new IdGenerator();</span></span>
<span class="line"><span>  private IdGenerator() {}</span></span>
<span class="line"><span>  public static IdGenerator getInstance() {</span></span>
<span class="line"><span>    return instance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public long getId() { </span></span>
<span class="line"><span>    return id.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有人觉得这种实现方式不好，因为不支持延迟加载，如果实例占用资源多（比如占用内存多）或初始化耗时长（比如需要加载各种配置文件），提前初始化实例是一种浪费资源的行为。最好的方法应该在用到的时候再去初始化。不过，我个人并不认同这样的观点。</p><p>如果初始化耗时长，那我们最好不要等到真正要用它的时候，才去执行这个耗时长的初始化过程，这会影响到系统的性能（比如，在响应客户端接口请求的时候，做这个初始化操作，会导致此请求的响应时间变长，甚至超时）。采用饿汉式实现方式，将耗时的初始化操作，提前到程序启动的时候完成，这样就能避免在程序运行的时候，再去初始化导致的性能问题。</p><p>如果实例占用资源多，按照fail-fast的设计原则（有问题及早暴露），那我们也希望在程序启动时就将这个实例初始化好。如果资源不够，就会在程序启动的时候触发报错（比如Java中的 PermGen Space OOM），我们可以立即去修复。这样也能避免在程序运行一段时间后，突然因为初始化这个实例占用资源过多，导致系统崩溃，影响系统的可用性。</p><h3 id="_2-懒汉式" tabindex="-1"><a class="header-anchor" href="#_2-懒汉式"><span>2.懒汉式</span></a></h3><p>有饿汉式，对应的，就有懒汉式。懒汉式相对于饿汉式的优势是支持延迟加载。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class IdGenerator { </span></span>
<span class="line"><span>  private AtomicLong id = new AtomicLong(0);</span></span>
<span class="line"><span>  private static IdGenerator instance;</span></span>
<span class="line"><span>  private IdGenerator() {}</span></span>
<span class="line"><span>  public static synchronized IdGenerator getInstance() {</span></span>
<span class="line"><span>    if (instance == null) {</span></span>
<span class="line"><span>      instance = new IdGenerator();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return instance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public long getId() { </span></span>
<span class="line"><span>    return id.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过懒汉式的缺点也很明显，我们给getInstance()这个方法加了一把大锁（synchronzed），导致这个函数的并发度很低。量化一下的话，并发度是1，也就相当于串行操作了。而这个函数是在单例使用期间，一直会被调用。如果这个单例类偶尔会被用到，那这种实现方式还可以接受。但是，如果频繁地用到，那频繁加锁、释放锁及并发度低等问题，会导致性能瓶颈，这种实现方式就不可取了。</p><h3 id="_3-双重检测" tabindex="-1"><a class="header-anchor" href="#_3-双重检测"><span>3.双重检测</span></a></h3><p>饿汉式不支持延迟加载，懒汉式有性能问题，不支持高并发。那我们再来看一种既支持延迟加载、又支持高并发的单例实现方式，也就是双重检测实现方式。</p><p>在这种实现方式中，只要instance被创建之后，即便再调用getInstance()函数也不会再进入到加锁逻辑中了。所以，这种实现方式解决了懒汉式并发度低的问题。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class IdGenerator { </span></span>
<span class="line"><span>  private AtomicLong id = new AtomicLong(0);</span></span>
<span class="line"><span>  private static IdGenerator instance;</span></span>
<span class="line"><span>  private IdGenerator() {}</span></span>
<span class="line"><span>  public static IdGenerator getInstance() {</span></span>
<span class="line"><span>    if (instance == null) {</span></span>
<span class="line"><span>      synchronized(IdGenerator.class) { // 此处为类级别的锁</span></span>
<span class="line"><span>        if (instance == null) {</span></span>
<span class="line"><span>          instance = new IdGenerator();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return instance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public long getId() { </span></span>
<span class="line"><span>    return id.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>网上有人说，这种实现方式有些问题。因为指令重排序，可能会导致IdGenerator对象被new出来，并且赋值给instance之后，还没来得及初始化（执行构造函数中的代码逻辑），就被另一个线程使用了。</p><p>要解决这个问题，我们需要给instance成员变量加上volatile关键字，禁止指令重排序才行。实际上，只有很低版本的Java才会有这个问题。我们现在用的高版本的Java已经在JDK内部实现中解决了这个问题（解决的方法很简单，只要把对象new操作和初始化操作设计为原子操作，就自然能禁止重排序）。关于这点的详细解释，跟特定语言有关，我就不展开讲了，感兴趣的同学可以自行研究一下。</p><h3 id="_4-静态内部类" tabindex="-1"><a class="header-anchor" href="#_4-静态内部类"><span>4.静态内部类</span></a></h3><p>我们再来看一种比双重检测更加简单的实现方法，那就是利用Java的静态内部类。它有点类似饿汉式，但又能做到了延迟加载。具体是怎么做到的呢？我们先来看它的代码实现。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class IdGenerator { </span></span>
<span class="line"><span>  private AtomicLong id = new AtomicLong(0);</span></span>
<span class="line"><span>  private IdGenerator() {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private static class SingletonHolder{</span></span>
<span class="line"><span>    private static final IdGenerator instance = new IdGenerator();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public static IdGenerator getInstance() {</span></span>
<span class="line"><span>    return SingletonHolder.instance;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  public long getId() { </span></span>
<span class="line"><span>    return id.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>SingletonHolder 是一个静态内部类，当外部类IdGenerator被加载的时候，并不会创建SingletonHolder实例对象。只有当调用getInstance()方法时，SingletonHolder才会被加载，这个时候才会创建instance。instance的唯一性、创建过程的线程安全性，都由JVM来保证。所以，这种实现方法既保证了线程安全，又能做到延迟加载。</p><h3 id="_5-枚举" tabindex="-1"><a class="header-anchor" href="#_5-枚举"><span>5.枚举</span></a></h3><p>最后，我们介绍一种最简单的实现方式，基于枚举类型的单例实现。这种实现方式通过Java枚举类型本身的特性，保证了实例创建的线程安全性和实例的唯一性。具体的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public enum IdGenerator {</span></span>
<span class="line"><span>  INSTANCE;</span></span>
<span class="line"><span>  private AtomicLong id = new AtomicLong(0);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  public long getId() { </span></span>
<span class="line"><span>    return id.incrementAndGet();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。我们来总结回顾一下，你需要掌握的重点内容。</p><p><strong>1.单例的定义</strong></p><p>单例设计模式（Singleton Design Pattern）理解起来非常简单。一个类只允许创建一个对象（或者叫实例），那这个类就是一个单例类，这种设计模式就叫作单例设计模式，简称单例模式。</p><p><strong>2.单例的用处</strong></p><p>从业务概念上，有些数据在系统中只应该保存一份，就比较适合设计为单例类。比如，系统的配置信息类。除此之外，我们还可以使用单例解决资源访问冲突的问题。</p><p><strong>3.单例的实现</strong></p><p>单例有下面几种经典的实现方式。</p><ul><li>饿汉式</li></ul><p>饿汉式的实现方式，在类加载的期间，就已经将instance静态实例初始化好了，所以，instance实例的创建是线程安全的。不过，这样的实现方式不支持延迟加载实例。</p><ul><li>懒汉式</li></ul><p>懒汉式相对于饿汉式的优势是支持延迟加载。这种实现方式会导致频繁加锁、释放锁，以及并发度低等问题，频繁的调用会产生性能瓶颈。</p><ul><li>双重检测</li></ul><p>双重检测实现方式既支持延迟加载、又支持高并发的单例实现方式。只要instance被创建之后，再调用getInstance()函数都不会进入到加锁逻辑中。所以，这种实现方式解决了懒汉式并发度低的问题。</p><ul><li>静态内部类</li></ul><p>利用Java的静态内部类来实现单例。这种实现方式，既支持延迟加载，也支持高并发，实现起来也比双重检测简单。</p><ul><li>枚举</li></ul><p>最简单的实现方式，基于枚举类型的单例实现。这种实现方式通过Java枚举类型本身的特性，保证了实例创建的线程安全性和实例的唯一性。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><ol><li>在你所熟悉的编程语言的类库中，有哪些类是单例类？又为什么要设计成单例类呢？</li><li>在第一个实战案例中，除了我们讲到的类级别锁、分布式锁、并发队列、单例模式等解决方案之外，实际上还有一种非常简单的解决日志互相覆盖问题的方法，你想到了吗？</li></ol><p>可以在留言区说一说，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,81)]))}const t=s(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E5%88%9B%E5%BB%BA%E5%9E%8B/41%20_%20%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%B8%8A%EF%BC%89%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E8%AF%B4%E6%94%AF%E6%8C%81%E6%87%92%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8F%8C%E9%87%8D%E6%A3%80%E6%B5%8B%E4%B8%8D%E6%AF%94%E9%A5%BF%E6%B1%89%E5%BC%8F%E6%9B%B4%E4%BC%98%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"从今天开始，我们正式进入到设计模式的学习。我们知道，经典的设计模式有23种。其中，常用的并不是很多。据我的工作经验来看，常用的可能都不到一半。如果随便抓一个程序员，让他说一说最熟悉的3种设计模式，那其中肯定会包含今天要讲的单例模式。 网上有很多讲解单例模式的文章，但大部分都侧重讲解，如何来实现一个线程安全的单例。我今天也会讲到各种单例的实现方法，但是，...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E5%88%9B%E5%BB%BA%E5%9E%8B/41%20_%20%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%B8%8A%EF%BC%89%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E8%AF%B4%E6%94%AF%E6%8C%81%E6%87%92%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8F%8C%E9%87%8D%E6%A3%80%E6%B5%8B%E4%B8%8D%E6%AF%94%E9%A5%BF%E6%B1%89%E5%BC%8F%E6%9B%B4%E4%BC%98%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"从今天开始，我们正式进入到设计模式的学习。我们知道，经典的设计模式有23种。其中，常用的并不是很多。据我的工作经验来看，常用的可能都不到一半。如果随便抓一个程序员，让他说一说最熟悉的3种设计模式，那其中肯定会包含今天要讲的单例模式。 网上有很多讲解单例模式的文章，但大部分都侧重讲解，如何来实现一个线程安全的单例。我今天也会讲到各种单例的实现方法，但是，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":15.37,"words":4612},"filePathRelative":"posts/设计模式之美/设计模式与范式：创建型/41 _ 单例模式（上）：为什么说支持懒加载的双重检测不比饿汉式更优？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"41 | 单例模式（上）：为什么说支持懒加载的双重检测不比饿汉式更优？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/c0/5b/c040683ccf363d91563d018ad7f7715b.mp3\\"></audio></p>\\n<p>从今天开始，我们正式进入到设计模式的学习。我们知道，经典的设计模式有23种。其中，常用的并不是很多。据我的工作经验来看，常用的可能都不到一半。如果随便抓一个程序员，让他说一说最熟悉的3种设计模式，那其中肯定会包含今天要讲的单例模式。</p>","autoDesc":true}');export{t as comp,v as data};
