import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(r,n){return i(),s("div",null,n[0]||(n[0]=[e(`<h1 id="第19讲-java并发包提供了哪些并发工具类" tabindex="-1"><a class="header-anchor" href="#第19讲-java并发包提供了哪些并发工具类"><span>第19讲 _ Java并发包提供了哪些并发工具类？</span></a></h1><p><audio id="audio" title="第19讲 | Java并发包提供了哪些并发工具类？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/6b/1e/6bbdab57a6d659804f0202559397761e.mp3"></audio></p><p>通过前面的学习，我们一起回顾了线程、锁等各种并发编程的基本元素，也逐步涉及了Java并发包中的部分内容，相信经过前面的热身，我们能够更快地理解Java并发包。</p><p>今天我要问你的问题是，Java并发包提供了哪些并发工具类？</p><h2 id="典型回答" tabindex="-1"><a class="header-anchor" href="#典型回答"><span>典型回答</span></a></h2><p>我们通常所说的并发包也就是java.util.concurrent及其子包，集中了Java并发的各种基础工具类，具体主要包括几个方面：</p><li> 提供了比synchronized更加高级的各种同步结构，包括CountDownLatch、CyclicBarrier、Semaphore等，可以实现更加丰富的多线程操作，比如利用Semaphore作为资源控制器，限制同时进行工作的线程数量。 </li><li> 各种线程安全的容器，比如最常见的ConcurrentHashMap、有序的ConcurrentSkipListMap，或者通过类似快照机制，实现线程安全的动态数组CopyOnWriteArrayList等。 </li><li> 各种并发队列实现，如各种BlockingQueue实现，比较典型的ArrayBlockingQueue、 SynchronousQueue或针对特定场景的PriorityBlockingQueue等。 </li><li> 强大的Executor框架，可以创建各种不同类型的线程池，调度任务运行等，绝大部分情况下，不再需要自己从头实现线程池和任务调度器。 </li><h2 id="考点分析" tabindex="-1"><a class="header-anchor" href="#考点分析"><span>考点分析</span></a></h2><p>这个题目主要考察你对并发包了解程度，以及是否有实际使用经验。我们进行多线程编程，无非是达到几个目的：</p><li> 利用多线程提高程序的扩展能力，以达到业务对吞吐量的要求。 </li><li> 协调线程间调度、交互，以完成业务逻辑。 </li><li> 线程间传递数据和状态，这同样是实现业务逻辑的需要。 </li><p>所以，这道题目只能算作简单的开始，往往面试官还会进一步考察如何利用并发包实现某个特定的用例，分析实现的优缺点等。</p><p>如果你在这方面的基础比较薄弱，我的建议是：</p><li> 从总体上，把握住几个主要组成部分（前面回答中已经简要介绍）。 </li><li> 理解具体设计、实现和能力。 </li><li> 再深入掌握一些比较典型工具类的适用场景、用法甚至是原理，并熟练写出典型的代码用例。 </li><p>掌握这些通常就够用了，毕竟并发包提供了方方面面的工具，其实很少有机会能在应用中全面使用过，扎实地掌握核心功能就非常不错了。真正特别深入的经验，还是得靠在实际场景中踩坑来获得。</p><h2 id="知识扩展" tabindex="-1"><a class="header-anchor" href="#知识扩展"><span>知识扩展</span></a></h2><p>首先，我们来看看并发包提供的丰富同步结构。前面几讲已经分析过各种不同的显式锁，今天我将专注于</p><li> [CountDownLatch](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/CountDownLatch.html)，允许一个或多个线程等待某些操作完成。 </li><li> [CyclicBarrier](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/CyclicBarrier.html)，一种辅助性的同步结构，允许多个线程等待到达某个屏障。 </li><li> [Semaphore](https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Semaphore.html)，Java版本的信号量实现。 </li><p>Java提供了经典信号量（<a href="https://en.wikipedia.org/wiki/Semaphore_(programming)" target="_blank" rel="noopener noreferrer">Semaphore</a>）的实现，它通过控制一定数量的允许（permit）的方式，来达到限制通用资源访问的目的。你可以想象一下这个场景，在车站、机场等出租车时，当很多空出租车就位时，为防止过度拥挤，调度员指挥排队等待坐车的队伍一次进来5个人上车，等这5个人坐车出发，再放进去下一批，这和Semaphore的工作原理有些类似。</p><p>你可以试试使用Semaphore来模拟实现这个调度过程：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import java.util.concurrent.Semaphore;</span></span>
<span class="line"><span>public class UsualSemaphoreSample {</span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    	System.out.println(&amp;quot;Action...GO!&amp;quot;);</span></span>
<span class="line"><span>    	Semaphore semaphore = new Semaphore(5);</span></span>
<span class="line"><span>    	for (int i = 0; i &amp;lt; 10; i++) {</span></span>
<span class="line"><span>        	Thread t = new Thread(new SemaphoreWorker(semaphore));</span></span>
<span class="line"><span>        	t.start();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class SemaphoreWorker implements Runnable {</span></span>
<span class="line"><span>	private String name;</span></span>
<span class="line"><span>	private Semaphore semaphore;</span></span>
<span class="line"><span>	public SemaphoreWorker(Semaphore semaphore) {</span></span>
<span class="line"><span>    	this.semaphore = semaphore;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public void run() {</span></span>
<span class="line"><span>    	try {</span></span>
<span class="line"><span>        	log(&amp;quot;is waiting for a permit!&amp;quot;);</span></span>
<span class="line"><span>       	semaphore.acquire();</span></span>
<span class="line"><span>        	log(&amp;quot;acquired a permit!&amp;quot;);</span></span>
<span class="line"><span>        	log(&amp;quot;executed!&amp;quot;);</span></span>
<span class="line"><span>    	} catch (InterruptedException e) {</span></span>
<span class="line"><span>        	e.printStackTrace();</span></span>
<span class="line"><span>    	} finally {</span></span>
<span class="line"><span>        	log(&amp;quot;released a permit!&amp;quot;);</span></span>
<span class="line"><span>        	semaphore.release();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	private void log(String msg){</span></span>
<span class="line"><span>    	if (name == null) {</span></span>
<span class="line"><span>        	name = Thread.currentThread().getName();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    	System.out.println(name + &amp;quot; &amp;quot; + msg);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码是比较典型的Semaphore示例，其逻辑是，线程试图获得工作允许，得到许可则进行任务，然后释放许可，这时等待许可的其他线程，就可获得许可进入工作状态，直到全部处理结束。编译运行，我们就能看到Semaphore的允许机制对工作线程的限制。</p><p>但是，从具体节奏来看，其实并不符合我们前面场景的需求，因为本例中Semaphore的用法实际是保证，一直有5个人可以试图乘车，如果有1个人出发了，立即就有排队的人获得许可，而这并不完全符合我们前面的要求。</p><p>那么，我再修改一下，演示个非典型的Semaphore用法。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import java.util.concurrent.Semaphore;</span></span>
<span class="line"><span>public class AbnormalSemaphoreSample {</span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    	Semaphore semaphore = new Semaphore(0);</span></span>
<span class="line"><span>    	for (int i = 0; i &amp;lt; 10; i++) {</span></span>
<span class="line"><span>        	Thread t = new Thread(new MyWorker(semaphore));</span></span>
<span class="line"><span>        	t.start();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    	System.out.println(&amp;quot;Action...GO!&amp;quot;);</span></span>
<span class="line"><span>    	semaphore.release(5);</span></span>
<span class="line"><span>    	System.out.println(&amp;quot;Wait for permits off&amp;quot;);</span></span>
<span class="line"><span>    	while (semaphore.availablePermits()!=0) {</span></span>
<span class="line"><span>        	Thread.sleep(100L);</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    	System.out.println(&amp;quot;Action...GO again!&amp;quot;);</span></span>
<span class="line"><span>    	semaphore.release(5);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class MyWorker implements Runnable {</span></span>
<span class="line"><span>	private Semaphore semaphore;</span></span>
<span class="line"><span>	public MyWorker(Semaphore semaphore) {</span></span>
<span class="line"><span>    	this.semaphore = semaphore;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public void run() {</span></span>
<span class="line"><span>    	try {</span></span>
<span class="line"><span>        	semaphore.acquire();</span></span>
<span class="line"><span>        	System.out.println(&amp;quot;Executed!&amp;quot;);</span></span>
<span class="line"><span>    	} catch (InterruptedException e) {</span></span>
<span class="line"><span>        	e.printStackTrace();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，上面的代码，更侧重的是演示Semaphore的功能以及局限性，其实有很多线程编程中的反实践，比如使用了sleep来协调任务执行，而且使用轮询调用availalePermits来检测信号量获取情况，这都是很低效并且脆弱的，通常只是用在测试或者诊断场景。</p><p>总的来说，我们可以看出Semaphore就是个<strong>计数器</strong>，<strong>其基本逻辑基于acquire/release</strong>，并没有太复杂的同步逻辑。</p><p>如果Semaphore的数值被初始化为1，那么一个线程就可以通过acquire进入互斥状态，本质上和互斥锁是非常相似的。但是区别也非常明显，比如互斥锁是有持有者的，而对于Semaphore这种计数器结构，虽然有类似功能，但其实不存在真正意义的持有者，除非我们进行扩展包装。</p><p>下面，来看看CountDownLatch和CyclicBarrier，它们的行为有一定的相似度，经常会被考察二者有什么区别，我来简单总结一下。</p><li> CountDownLatch是不可以重置的，所以无法重用；而CyclicBarrier则没有这种限制，可以重用。 </li><li> CountDownLatch的基本操作组合是countDown/await。调用await的线程阻塞等待countDown足够的次数，不管你是在一个线程还是多个线程里countDown，只要次数足够即可。所以就像Brain Goetz说过的，CountDownLatch操作的是事件。 </li><li> CyclicBarrier的基本操作组合，则就是await，当所有的伙伴（parties）都调用了await，才会继续进行任务，并自动进行重置。**注意**，正常情况下，CyclicBarrier的重置都是自动发生的，如果我们调用reset方法，但还有线程在等待，就会导致等待线程被打扰，抛出BrokenBarrierException异常。CyclicBarrier侧重点是线程，而不是调用事件，它的典型应用场景是用来等待并发线程结束。 </li><p>如果用CountDownLatch去实现上面的排队场景，该怎么做呢？假设有10个人排队，我们将其分成5个人一批，通过CountDownLatch来协调批次，你可以试试下面的示例代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import java.util.concurrent.CountDownLatch;</span></span>
<span class="line"><span>public class LatchSample {</span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    	CountDownLatch latch = new CountDownLatch(6);</span></span>
<span class="line"><span>           for (int i = 0; i &amp;lt; 5; i++) {</span></span>
<span class="line"><span>                Thread t = new Thread(new FirstBatchWorker(latch));</span></span>
<span class="line"><span>                t.start();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    	for (int i = 0; i &amp;lt; 5; i++) {</span></span>
<span class="line"><span>        	    Thread t = new Thread(new SecondBatchWorker(latch));</span></span>
<span class="line"><span>        	    t.start();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>           // 注意这里也是演示目的的逻辑，并不是推荐的协调方式</span></span>
<span class="line"><span>    	while ( latch.getCount() != 1 ){</span></span>
<span class="line"><span>        	    Thread.sleep(100L);</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    	System.out.println(&amp;quot;Wait for first batch finish&amp;quot;);</span></span>
<span class="line"><span>    	latch.countDown();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class FirstBatchWorker implements Runnable {</span></span>
<span class="line"><span>	private CountDownLatch latch;</span></span>
<span class="line"><span>	public FirstBatchWorker(CountDownLatch latch) {</span></span>
<span class="line"><span>    	this.latch = latch;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public void run() {</span></span>
<span class="line"><span>        	System.out.println(&amp;quot;First batch executed!&amp;quot;);</span></span>
<span class="line"><span>        	latch.countDown();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class SecondBatchWorker implements Runnable {</span></span>
<span class="line"><span>	private CountDownLatch latch;</span></span>
<span class="line"><span>	public SecondBatchWorker(CountDownLatch latch) {</span></span>
<span class="line"><span>    	this.latch = latch;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public void run() {</span></span>
<span class="line"><span>    	try {</span></span>
<span class="line"><span>        	latch.await();</span></span>
<span class="line"><span>        	System.out.println(&amp;quot;Second batch executed!&amp;quot;);</span></span>
<span class="line"><span>    	} catch (InterruptedException e) {</span></span>
<span class="line"><span>        	e.printStackTrace();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>CountDownLatch的调度方式相对简单，后一批次的线程进行await，等待前一批countDown足够多次。这个例子也从侧面体现出了它的局限性，虽然它也能够支持10个人排队的情况，但是因为不能重用，如果要支持更多人排队，就不能依赖一个CountDownLatch进行了。其编译运行输出如下：</p><img src="https://static001.geekbang.org/resource/image/46/b9/46c88c7d8e0507465bddb677e4eac5b9.png" alt=""><p>在实际应用中的条件依赖，往往没有这么别扭，CountDownLatch用于线程间等待操作结束是非常简单普遍的用法。通过countDown/await组合进行通信是很高效的，通常不建议使用例子里那个循环等待方式。</p><p>如果用CyclicBarrier来表达这个场景呢？我们知道CyclicBarrier其实反映的是线程并行运行时的协调，在下面的示例里，从逻辑上，5个工作线程其实更像是代表了5个可以就绪的空车，而不再是5个乘客，对比前面CountDownLatch的例子更有助于我们区别它们的抽象模型，请看下面的示例代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>import java.util.concurrent.BrokenBarrierException;</span></span>
<span class="line"><span>import java.util.concurrent.CyclicBarrier;</span></span>
<span class="line"><span>public class CyclicBarrierSample {</span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    	CyclicBarrier barrier = new CyclicBarrier(5, new Runnable() {</span></span>
<span class="line"><span>        	@Override</span></span>
<span class="line"><span>        	public void run() {</span></span>
<span class="line"><span>            	System.out.println(&amp;quot;Action...GO again!&amp;quot;);</span></span>
<span class="line"><span>        	}</span></span>
<span class="line"><span>    	});</span></span>
<span class="line"><span>    	for (int i = 0; i &amp;lt; 5; i++) {</span></span>
<span class="line"><span>        	Thread t = new Thread(new CyclicWorker(barrier));</span></span>
<span class="line"><span>        	t.start();</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	static class CyclicWorker implements Runnable {</span></span>
<span class="line"><span>    	private CyclicBarrier barrier;</span></span>
<span class="line"><span>    	public CyclicWorker(CyclicBarrier barrier) {</span></span>
<span class="line"><span>        	this.barrier = barrier;</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    	@Override</span></span>
<span class="line"><span>    	public void run() {</span></span>
<span class="line"><span>        	try {</span></span>
<span class="line"><span>            	for (int i=0; i&amp;lt;3 ; i++){</span></span>
<span class="line"><span>                	System.out.println(&amp;quot;Executed!&amp;quot;);</span></span>
<span class="line"><span>                	barrier.await();</span></span>
<span class="line"><span>            	}</span></span>
<span class="line"><span>        	} catch (BrokenBarrierException e) {</span></span>
<span class="line"><span>            	e.printStackTrace();</span></span>
<span class="line"><span>        	} catch (InterruptedException e) {</span></span>
<span class="line"><span>            	e.printStackTrace();</span></span>
<span class="line"><span>        	}</span></span>
<span class="line"><span> 	   }</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了让输出更能表达运行时序，我使用了CyclicBarrier特有的barrierAction，当屏障被触发时，Java会自动调度该动作。因为CyclicBarrier会<strong>自动</strong>进行重置，所以这个逻辑其实可以非常自然的支持更多排队人数。其编译输出如下：</p><img src="https://static001.geekbang.org/resource/image/ef/9f/eff56d3219ce5493ecacc70a168b2b9f.png" alt=""><p>Java并发类库还提供了<a href="https://docs.oracle.com/javase/9/docs/api/java/util/concurrent/Phaser.html" target="_blank" rel="noopener noreferrer">Phaser</a>，功能与CountDownLatch很接近，但是它允许线程动态地注册到Phaser上面，而CountDownLatch显然是不能动态设置的。Phaser的设计初衷是，实现多个线程类似步骤、阶段场景的协调，线程注册等待屏障条件触发，进而协调彼此间行动，具体请参考这个<a href="http://www.baeldung.com/java-phaser" target="_blank" rel="noopener noreferrer">例子</a>。</p><p>接下来，我来梳理下并发包里提供的线程安全Map、List和Set。首先，请参考下面的类图。</p><img src="https://static001.geekbang.org/resource/image/35/57/35390aa8a6e6f9c92fda086a1b95b457.png" alt=""><p>你可以看到，总体上种类和结构还是比较简单的，如果我们的应用侧重于Map放入或者获取的速度，而不在乎顺序，大多推荐使用ConcurrentHashMap，反之则使用ConcurrentSkipListMap；如果我们需要对大量数据进行非常频繁地修改，ConcurrentSkipListMap也可能表现出优势。</p><p>我在前面的专栏，谈到了普通无顺序场景选择HashMap，有顺序场景则可以选择类似TreeMap等，但是为什么并发容器里面没有ConcurrentTreeMap呢？</p><p>这是因为TreeMap要实现高效的线程安全是非常困难的，它的实现基于复杂的红黑树。为保证访问效率，当我们插入或删除节点时，会移动节点进行平衡操作，这导致在并发场景中难以进行合理粒度的同步。而SkipList结构则要相对简单很多，通过层次结构提高访问速度，虽然不够紧凑，空间使用有一定提高（O(nlogn)），但是在增删元素时线程安全的开销要好很多。为了方便你理解SkipList的内部结构，我画了一个示意图。</p><img src="https://static001.geekbang.org/resource/image/63/7b/63b94b5b1d002bb191c75d2c48af767b.png" alt=""><p>关于两个CopyOnWrite容器，其实CopyOnWriteArraySet是通过包装了CopyOnWriteArrayList来实现的，所以在学习时，我们可以专注于理解一种。</p><p>首先，CopyOnWrite到底是什么意思呢？它的原理是，任何修改操作，如add、set、remove，都会拷贝原数组，修改后替换原来的数组，通过这种防御性的方式，实现另类的线程安全。请看下面的代码片段，我进行注释的地方，可以清晰地理解其逻辑。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public boolean add(E e) {</span></span>
<span class="line"><span>	synchronized (lock) {</span></span>
<span class="line"><span>    	Object[] elements = getArray();</span></span>
<span class="line"><span>    	int len = elements.length;</span></span>
<span class="line"><span>           // 拷贝</span></span>
<span class="line"><span>    	Object[] newElements = Arrays.copyOf(elements, len + 1);</span></span>
<span class="line"><span>    	newElements[len] = e;</span></span>
<span class="line"><span>           // 替换</span></span>
<span class="line"><span>    	setArray(newElements);</span></span>
<span class="line"><span>    	return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>final void setArray(Object[] a) {</span></span>
<span class="line"><span>	array = a;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以这种数据结构，相对比较适合读多写少的操作，不然修改的开销还是非常明显的。</p><p>今天我对Java并发包进行了总结，并且结合实例分析了各种同步结构和部分线程安全容器，希望对你有所帮助。</p><h2 id="一课一练" tabindex="-1"><a class="header-anchor" href="#一课一练"><span>一课一练</span></a></h2><p>关于今天我们讨论的题目你做到心中有数了吗？留给你的思考题是，你使用过类似CountDownLatch的同步结构解决实际问题吗？谈谈你的使用场景和心得。</p><p>请你在留言区写写你对这个问题的思考，我会选出经过认真思考的留言，送给你一份学习奖励礼券，欢迎你与我一起讨论。</p><p>你的朋友是不是也在准备面试呢？你可以“请朋友读”，把今天的题目分享给好友，或许你能帮到他。</p>`,65)]))}const d=a(p,[["render",l]]),v=JSON.parse('{"path":"/posts/Java%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E9%9D%A2%E8%AF%95%E7%B2%BE%E8%AE%B2/%E6%A8%A1%E5%9D%97%E4%BA%8C%20%20Java%E8%BF%9B%E9%98%B6/%E7%AC%AC19%E8%AE%B2%20_%20Java%E5%B9%B6%E5%8F%91%E5%8C%85%E6%8F%90%E4%BE%9B%E4%BA%86%E5%93%AA%E4%BA%9B%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB%EF%BC%9F.html","title":"第19讲 _ Java并发包提供了哪些并发工具类？","lang":"zh-CN","frontmatter":{"description":"第19讲 _ Java并发包提供了哪些并发工具类？ 通过前面的学习，我们一起回顾了线程、锁等各种并发编程的基本元素，也逐步涉及了Java并发包中的部分内容，相信经过前面的热身，我们能够更快地理解Java并发包。 今天我要问你的问题是，Java并发包提供了哪些并发工具类？ 典型回答 我们通常所说的并发包也就是java.util.concurrent及其子...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E9%9D%A2%E8%AF%95%E7%B2%BE%E8%AE%B2/%E6%A8%A1%E5%9D%97%E4%BA%8C%20%20Java%E8%BF%9B%E9%98%B6/%E7%AC%AC19%E8%AE%B2%20_%20Java%E5%B9%B6%E5%8F%91%E5%8C%85%E6%8F%90%E4%BE%9B%E4%BA%86%E5%93%AA%E4%BA%9B%E5%B9%B6%E5%8F%91%E5%B7%A5%E5%85%B7%E7%B1%BB%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"第19讲 _ Java并发包提供了哪些并发工具类？"}],["meta",{"property":"og:description","content":"第19讲 _ Java并发包提供了哪些并发工具类？ 通过前面的学习，我们一起回顾了线程、锁等各种并发编程的基本元素，也逐步涉及了Java并发包中的部分内容，相信经过前面的热身，我们能够更快地理解Java并发包。 今天我要问你的问题是，Java并发包提供了哪些并发工具类？ 典型回答 我们通常所说的并发包也就是java.util.concurrent及其子..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"第19讲 _ Java并发包提供了哪些并发工具类？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":11.31,"words":3393},"filePathRelative":"posts/Java核心技术面试精讲/模块二  Java进阶/第19讲 _ Java并发包提供了哪些并发工具类？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"第19讲 | Java并发包提供了哪些并发工具类？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/6b/1e/6bbdab57a6d659804f0202559397761e.mp3\\"></audio></p>\\n<p>通过前面的学习，我们一起回顾了线程、锁等各种并发编程的基本元素，也逐步涉及了Java并发包中的部分内容，相信经过前面的热身，我们能够更快地理解Java并发包。</p>\\n<p>今天我要问你的问题是，Java并发包提供了哪些并发工具类？</p>","autoDesc":true}');export{d as comp,v as data};
