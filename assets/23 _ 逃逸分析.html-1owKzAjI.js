import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const l={};function p(c,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="23 | 逃逸分析" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/05/0d/054b2598525125962d849f09ee3df40d.mp3"></audio></p><p>我们知道，Java中<code>Iterable</code>对象的foreach循环遍历是一个语法糖，Java编译器会将该语法糖编译为调用<code>Iterable</code>对象的<code>iterator</code>方法，并用所返回的<code>Iterator</code>对象的<code>hasNext</code>以及<code>next</code>方法，来完成遍历。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void forEach(ArrayList&amp;lt;Object&amp;gt; list, Consumer&amp;lt;Object&amp;gt; f) {</span></span>
<span class="line"><span>  for (Object obj : list) {</span></span>
<span class="line"><span>    f.accept(obj);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，上面的Java代码将使用foreach循环来遍历一个<code>ArrayList</code>对象，其等价的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void forEach(ArrayList&amp;lt;Object&amp;gt; list, Consumer&amp;lt;Object&amp;gt; f) {</span></span>
<span class="line"><span>  Iterator&amp;lt;Object&amp;gt; iter = list.iterator();</span></span>
<span class="line"><span>  while (iter.hasNext()) {</span></span>
<span class="line"><span>    Object obj = iter.next();</span></span>
<span class="line"><span>    f.accept(obj);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我也列举了所涉及的<code>ArrayList</code>代码。我们可以看到，<code>ArrayList.iterator</code>方法将创建一个<code>ArrayList$Itr</code>实例。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class ArrayList ... {</span></span>
<span class="line"><span>  public Iterator&amp;lt;E&amp;gt; iterator() {</span></span>
<span class="line"><span>    return new Itr();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  private class Itr implements Iterator&amp;lt;E&amp;gt; {</span></span>
<span class="line"><span>    int cursor;       // index of next element to return</span></span>
<span class="line"><span>    int lastRet = -1; // index of last element returned; -1 if no such</span></span>
<span class="line"><span>    int expectedModCount = modCount;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    public boolean hasNext() {</span></span>
<span class="line"><span>      return cursor != size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @SuppressWarnings(&amp;quot;unchecked&amp;quot;)</span></span>
<span class="line"><span>    public E next() {</span></span>
<span class="line"><span>      checkForComodification();</span></span>
<span class="line"><span>      int i = cursor;</span></span>
<span class="line"><span>      if (i &amp;gt;= size)</span></span>
<span class="line"><span>        throw new NoSuchElementException();</span></span>
<span class="line"><span>      Object[] elementData = ArrayList.this.elementData;</span></span>
<span class="line"><span>      if (i &amp;gt;= elementData.length)</span></span>
<span class="line"><span>        throw new ConcurrentModificationException();</span></span>
<span class="line"><span>      cursor = i + 1;</span></span>
<span class="line"><span>      return (E) elementData[lastRet = i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    final void checkForComodification() {</span></span>
<span class="line"><span>      if (modCount != expectedModCount)</span></span>
<span class="line"><span>        throw new ConcurrentModificationException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此，有同学认为我们应当避免在热点代码中使用foreach循环，并且直接使用基于<code>ArrayList.size</code>以及<code>ArrayList.get</code>的循环方式（如下所示），以减少对Java堆的压力。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void forEach(ArrayList&amp;lt;Object&amp;gt; list, Consumer&amp;lt;Object&amp;gt; f) {</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; list.size(); i++) {</span></span>
<span class="line"><span>    f.accept(list.get(i));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，Java虚拟机中的即时编译器可以将<code>ArrayList.iterator</code>方法中的实例创建操作给优化掉。不过，这需要方法内联以及逃逸分析的协作。</p><p>在前面几篇中我们已经深入学习了方法内联，今天我便来介绍一下逃逸分析。</p><h2 id="逃逸分析" tabindex="-1"><a class="header-anchor" href="#逃逸分析"><span>逃逸分析</span></a></h2><p>逃逸分析是“一种确定指针动态范围的静态分析，它可以分析在程序的哪些地方可以访问到指针”（出处参见[1]）。</p><p>在Java虚拟机的即时编译语境下，逃逸分析将判断<strong>新建</strong>的对象是否<strong>逃逸</strong>。即时编译器判断对象是否逃逸的依据，一是对象是否被存入堆中（静态字段或者堆中对象的实例字段），二是对象是否被传入未知代码中。</p><p>前者很好理解：一旦对象被存入堆中，其他线程便能获得该对象的引用。即时编译器也因此无法追踪所有使用该对象的代码位置。</p><p>关于后者，由于Java虚拟机的即时编译器是以方法为单位的，对于方法中未被内联的方法调用，即时编译器会将其当成未知代码，毕竟它无法确认该方法调用会不会将调用者或所传入的参数存储至堆中。因此，我们可以认为方法调用的调用者以及参数是逃逸的。</p><p>通常来说，即时编译器里的逃逸分析是放在方法内联之后的，以便消除这些“未知代码”入口。</p><p>回到文章开头的例子。理想情况下，即时编译器能够内联对<code>ArrayList$Itr</code>构造器的调用，对<code>hasNext</code>以及<code>next</code>方法的调用，以及当内联了<code>Itr.next</code>方法后，对<code>checkForComodification</code>方法的调用。</p><p>如果这些方法调用均能够被内联，那么结果将近似于下面这段伪代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void forEach(ArrayList&amp;lt;Object&amp;gt; list, Consumer&amp;lt;Object&amp;gt; f) {</span></span>
<span class="line"><span>  Itr iter = new Itr; // 注意这里是new指令</span></span>
<span class="line"><span>  iter.cursor = 0;</span></span>
<span class="line"><span>  iter.lastRet = -1;</span></span>
<span class="line"><span>  iter.expectedModCount = list.modCount;</span></span>
<span class="line"><span>  while (iter.cursor &amp;lt; list.size) {</span></span>
<span class="line"><span>    if (list.modCount != iter.expectedModCount)</span></span>
<span class="line"><span>      throw new ConcurrentModificationException();</span></span>
<span class="line"><span>    int i = iter.cursor;</span></span>
<span class="line"><span>    if (i &amp;gt;= list.size)</span></span>
<span class="line"><span>      throw new NoSuchElementException();</span></span>
<span class="line"><span>    Object[] elementData = list.elementData;</span></span>
<span class="line"><span>    if (i &amp;gt;= elementData.length)</span></span>
<span class="line"><span>      throw new ConcurrentModificationException();</span></span>
<span class="line"><span>    iter.cursor = i + 1;</span></span>
<span class="line"><span>    iter.lastRet = i;</span></span>
<span class="line"><span>    Object obj = elementData[i];</span></span>
<span class="line"><span>    f.accept(obj);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，这段代码所新建的<code>ArrayList$Itr</code>实例既没有被存入任何字段之中，也没有作为任何方法调用的调用者或者参数。因此，逃逸分析将断定该实例不逃逸。</p><h2 id="基于逃逸分析的优化" tabindex="-1"><a class="header-anchor" href="#基于逃逸分析的优化"><span>基于逃逸分析的优化</span></a></h2><p>即时编译器可以根据逃逸分析的结果进行诸如锁消除、栈上分配以及标量替换的优化。</p><p>我们先来看一下锁消除。如果即时编译器能够证明锁对象不逃逸，那么对该锁对象的加锁、解锁操作没有意义。这是因为其他线程并不能获得该锁对象，因此也不可能对其进行加锁。在这种情况下，即时编译器可以消除对该不逃逸锁对象的加锁、解锁操作。</p><p>实际上，传统编译器仅需证明锁对象不逃逸出线程，便可以进行锁消除。由于Java虚拟机即时编译的限制，上述条件被强化为证明锁对象不逃逸出当前编译的方法。</p><p>在介绍Java内存模型时，我曾提过<code>synchronized (new Object()) {}</code>会被完全优化掉。这正是因为基于逃逸分析的锁消除。由于其他线程不能获得该锁对象，因此也无法基于该锁对象构造两个线程之间的happens-before规则。</p><p><code>synchronized (escapedObject) {}</code>则不然。由于其他线程可能会对逃逸了的对象<code>escapedObject</code>进行加锁操作，从而构造了两个线程之间的happens-before关系。因此即时编译器至少需要为这段代码生成一条刷新缓存的内存屏障指令。</p><p>不过，基于逃逸分析的锁消除实际上并不多见。一般来说，开发人员不会直接对方法中新构造的对象进行加锁。事实上，逃逸分析的结果更多被用于将新建对象操作转换成栈上分配或者标量替换。</p><p>我们知道，Java虚拟机中对象都是在堆上分配的，而堆上的内容对任何线程都是可见的。与此同时，Java虚拟机需要对所分配的堆内存进行管理，并且在对象不再被引用时回收其所占据的内存。</p><p>如果逃逸分析能够证明某些新建的对象不逃逸，那么Java虚拟机完全可以将其分配至栈上，并且在new语句所在的方法退出时，通过弹出当前方法的栈桢来自动回收所分配的内存空间。这样一来，我们便无须借助垃圾回收器来处理不再被引用的对象。</p><p>不过，由于实现起来需要更改大量假设了“对象只能堆分配”的代码，因此HotSpot虚拟机<strong>并没有</strong>采用栈上分配，而是使用了标量替换这么一项技术。</p><p>所谓的标量，就是仅能存储一个值的变量，比如Java代码中的局部变量。与之相反，聚合量则可能同时存储多个值，其中一个典型的例子便是Java对象。</p><p>标量替换这项优化技术，可以看成将原本对对象的字段的访问，替换为一个个局部变量的访问。举例来说，前面经过内联之后的forEach代码可以被转换为如下代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void forEach(ArrayList&amp;lt;Object&amp;gt; list, Consumer&amp;lt;Object&amp;gt; f) {</span></span>
<span class="line"><span>  // Itr iter = new Itr; // 经过标量替换后该分配无意义，可以被优化掉</span></span>
<span class="line"><span>  int cursor = 0;     // 标量替换</span></span>
<span class="line"><span>  int lastRet = -1;   // 标量替换</span></span>
<span class="line"><span>  int expectedModCount = list.modCount; // 标量替换</span></span>
<span class="line"><span>  while (cursor &amp;lt; list.size) {</span></span>
<span class="line"><span>    if (list.modCount != expectedModCount)</span></span>
<span class="line"><span>      throw new ConcurrentModificationException();</span></span>
<span class="line"><span>    int i = cursor;</span></span>
<span class="line"><span>    if (i &amp;gt;= list.size)</span></span>
<span class="line"><span>      throw new NoSuchElementException();</span></span>
<span class="line"><span>    Object[] elementData = list.elementData;</span></span>
<span class="line"><span>    if (i &amp;gt;= elementData.length)</span></span>
<span class="line"><span>      throw new ConcurrentModificationException();</span></span>
<span class="line"><span>    cursor = i + 1;</span></span>
<span class="line"><span>    lastRet = i;</span></span>
<span class="line"><span>    Object obj = elementData[i];</span></span>
<span class="line"><span>    f.accept(obj);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，原本需要在内存中连续分布的对象，现已被拆散为一个个单独的字段<code>cursor</code>，<code>lastRet</code>，以及<code>expectedModCount</code>。这些字段既可以存储在栈上，也可以直接存储在寄存器中。而该对象的对象头信息则直接消失了，不再被保存至内存之中。</p><p>由于该对象没有被实际分配，因此和栈上分配一样，它同样可以减轻垃圾回收的压力。与栈上分配相比，它对字段的内存连续性不做要求，而且，这些字段甚至可以直接在寄存器中维护，无须浪费任何内存空间。</p><h2 id="部分逃逸分析" tabindex="-1"><a class="header-anchor" href="#部分逃逸分析"><span>部分逃逸分析</span></a></h2><p>C2的逃逸分析与控制流无关，相对来说比较简单。Graal则引入了一个与控制流有关的逃逸分析，名为部分逃逸分析（partial escape analysis）[2]。它解决了所新建的实例仅在部分程序路径中逃逸的情况。</p><p>举个例子，在下面这段代码中，新建实例只会在进入if-then分支时逃逸。（对<code>hashCode</code>方法的调用是一个HotSpot intrinsic，将被替换为一个无法内联的本地方法调用。）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public static void bar(boolean cond) {</span></span>
<span class="line"><span>  Object foo = new Object();</span></span>
<span class="line"><span>  if (cond) {</span></span>
<span class="line"><span>    foo.hashCode();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 可以手工优化为：</span></span>
<span class="line"><span>public static void bar(boolean cond) {</span></span>
<span class="line"><span>  if (cond) {</span></span>
<span class="line"><span>    Object foo = new Object();</span></span>
<span class="line"><span>    foo.hashCode();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设if语句的条件成立的可能性只有1%，那么在99%的情况下，程序没有必要新建对象。其手工优化的版本正是部分逃逸分析想要自动达到的成果。</p><p>部分逃逸分析将根据控制流信息，判断出新建对象仅在部分分支中逃逸，并且将对象的新建操作推延至对象逃逸的分支中。这将使得原本因对象逃逸而无法避免的新建对象操作，不再出现在只执行if-else分支的程序路径之中。</p><p>综上，与C2所使用的逃逸分析相比，Graal所使用的部分逃逸分析能够优化更多的情况，不过它编译时间也更长一些。</p><h2 id="总结与实践" tabindex="-1"><a class="header-anchor" href="#总结与实践"><span>总结与实践</span></a></h2><p>今天我介绍了Java虚拟机中即时编译器的逃逸分析，以及基于逃逸分析的优化。</p><p>在Java虚拟机的即时编译语境下，逃逸分析将判断新建的对象是否会逃逸。即时编译器判断对象逃逸的依据有两个：一是看对象是否被存入堆中，二是看对象是否作为方法调用的调用者或者参数。</p><p>即时编译器会根据逃逸分析的结果进行优化，如锁消除以及标量替换。后者指的是将原本连续分配的对象拆散为一个个单独的字段，分布在栈上或者寄存器中。</p><p>部分逃逸分析是一种附带了控制流信息的逃逸分析。它将判断新建对象真正逃逸的分支，并且支持将新建操作推延至逃逸分支。</p><p>今天的实践环节有两项内容。</p><p>第一项内容，我们来验证一下<code>ArrayList.iterator</code>中的新建对象能否被逃逸分析所优化。运行下述代码并观察GC的情况。你可以通过虚拟机参数<code>-XX:-DoEscapeAnalysis</code>来关闭默认开启的逃逸分析。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// Run with</span></span>
<span class="line"><span>// java -XX:+PrintGC -XX:+DoEscapeAnalysis EscapeTest</span></span>
<span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.function.Consumer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class EscapeTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void forEach(ArrayList&amp;lt;Object&amp;gt; list, Consumer&amp;lt;Object&amp;gt; f) {</span></span>
<span class="line"><span>    for (Object obj : list) {</span></span>
<span class="line"><span>      f.accept(obj);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    ArrayList&amp;lt;Object&amp;gt; list = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 100; i++) {</span></span>
<span class="line"><span>      list.add(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 400_000_000; i++) {</span></span>
<span class="line"><span>      forEach(list, obj -&amp;gt; {});</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二项内容，我们来看一看部分逃逸分析的效果。你需要使用附带Graal编译器的Java版本，如Java 10，来运行下述代码，并且观察GC的情况。你可以通过虚拟机参数<code>-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler</code>来启用Graal。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// Run with</span></span>
<span class="line"><span>// java -Xlog:gc Foo</span></span>
<span class="line"><span>// java -XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler -Xlog:gc Foo</span></span>
<span class="line"><span>public class Foo {</span></span>
<span class="line"><span>  long placeHolder0;</span></span>
<span class="line"><span>  long placeHolder1;</span></span>
<span class="line"><span>  long placeHolder2;</span></span>
<span class="line"><span>  long placeHolder3;</span></span>
<span class="line"><span>  long placeHolder4;</span></span>
<span class="line"><span>  long placeHolder5;</span></span>
<span class="line"><span>  long placeHolder6;</span></span>
<span class="line"><span>  long placeHolder7;</span></span>
<span class="line"><span>  long placeHolder8;</span></span>
<span class="line"><span>  long placeHolder9;</span></span>
<span class="line"><span>  long placeHoldera;</span></span>
<span class="line"><span>  long placeHolderb;</span></span>
<span class="line"><span>  long placeHolderc;</span></span>
<span class="line"><span>  long placeHolderd;</span></span>
<span class="line"><span>  long placeHoldere;</span></span>
<span class="line"><span>  long placeHolderf;</span></span>
<span class="line"><span>  public static void bar(boolean condition) {</span></span>
<span class="line"><span>    Foo foo = new Foo();</span></span>
<span class="line"><span>    if (condition) {</span></span>
<span class="line"><span>      foo.hashCode();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; Integer.MAX_VALUE; i++) {</span></span>
<span class="line"><span>      bar(i % 100 == 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[1] <a href="https://zh.wikipedia.org/wiki/%E9%80%83%E9%80%B8%E5%88%86%E6%9E%90" target="_blank" rel="noopener noreferrer">https://zh.wikipedia.org/wiki/逃逸分析</a><br><br> [2] <a href="http://www.ssw.uni-linz.ac.at/Research/Papers/Stadler14/Stadler2014-CGO-PEA.pdf" target="_blank" rel="noopener noreferrer">http://www.ssw.uni-linz.ac.at/Research/Papers/Stadler14/Stadler2014-CGO-PEA.pdf</a></p>`,54)]))}const t=n(l,[["render",p]]),o=JSON.parse('{"path":"/posts/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9A%E9%AB%98%E6%95%88%E7%BC%96%E8%AF%91/23%20_%20%E9%80%83%E9%80%B8%E5%88%86%E6%9E%90.html","title":"","lang":"zh-CN","frontmatter":{"description":"我们知道，Java中Iterable对象的foreach循环遍历是一个语法糖，Java编译器会将该语法糖编译为调用Iterable对象的iterator方法，并用所返回的Iterator对象的hasNext以及next方法，来完成遍历。 举个例子，上面的Java代码将使用foreach循环来遍历一个ArrayList对象，其等价的代码如下所示： 这里我...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9A%E9%AB%98%E6%95%88%E7%BC%96%E8%AF%91/23%20_%20%E9%80%83%E9%80%B8%E5%88%86%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"我们知道，Java中Iterable对象的foreach循环遍历是一个语法糖，Java编译器会将该语法糖编译为调用Iterable对象的iterator方法，并用所返回的Iterator对象的hasNext以及next方法，来完成遍历。 举个例子，上面的Java代码将使用foreach循环来遍历一个ArrayList对象，其等价的代码如下所示： 这里我..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":10.12,"words":3036},"filePathRelative":"posts/深入拆解Java虚拟机/模块二：高效编译/23 _ 逃逸分析.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"23 | 逃逸分析\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/05/0d/054b2598525125962d849f09ee3df40d.mp3\\"></audio></p>\\n<p>我们知道，Java中<code>Iterable</code>对象的foreach循环遍历是一个语法糖，Java编译器会将该语法糖编译为调用<code>Iterable</code>对象的<code>iterator</code>方法，并用所返回的<code>Iterator</code>对象的<code>hasNext</code>以及<code>next</code>方法，来完成遍历。</p>","autoDesc":true}');export{t as comp,o as data};
