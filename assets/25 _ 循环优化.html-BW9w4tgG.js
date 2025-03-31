import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-CrA-f6So.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="_25-循环优化" tabindex="-1"><a class="header-anchor" href="#_25-循环优化"><span>25 _ 循环优化</span></a></h1><p><audio id="audio" title="25 | 循环优化" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/7e/67/7ed655e74b24aa5c935f328a6fc70167.mp3"></audio></p><p>在许多应用程序中，循环都扮演着非常重要的角色。为了提升循环的运行效率，研发编译器的工程师提出了不少面向循环的编译优化方式，如循环无关代码外提，循环展开等。</p><p>今天，我们便来了解一下，Java虚拟机中的即时编译器都应用了哪些面向循环的编译优化。</p><h2 id="循环无关代码外提" tabindex="-1"><a class="header-anchor" href="#循环无关代码外提"><span>循环无关代码外提</span></a></h2><p>所谓的循环无关代码（Loop-invariant Code），指的是循环中值不变的表达式。如果能够在不改变程序语义的情况下，将这些循环无关代码提出循环之外，那么程序便可以避免重复执行这些表达式，从而达到性能提升的效果。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int x, int y, int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>    sum += x * y + a[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 对应的字节码</span></span>
<span class="line"><span>int foo(int, int, int[]);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>     0: iconst_0</span></span>
<span class="line"><span>     1: istore 4</span></span>
<span class="line"><span>     3: iconst_0</span></span>
<span class="line"><span>     4: istore 5</span></span>
<span class="line"><span>     6: goto 25</span></span>
<span class="line"><span>// 循环体开始</span></span>
<span class="line"><span>     9: iload 4        // load sum</span></span>
<span class="line"><span>    11: iload_1        // load x</span></span>
<span class="line"><span>    12: iload_2        // load y</span></span>
<span class="line"><span>    13: imul           // x*y</span></span>
<span class="line"><span>    14: aload_3        // load a</span></span>
<span class="line"><span>    15: iload 5        // load i</span></span>
<span class="line"><span>    17: iaload         // a[i]</span></span>
<span class="line"><span>    18: iadd           // x*y + a[i]</span></span>
<span class="line"><span>    19: iadd           // sum + (x*y + a[i])</span></span>
<span class="line"><span>    20: istore 4       // sum = sum + (x*y + a[i])</span></span>
<span class="line"><span>    22: iinc 5, 1      // i++</span></span>
<span class="line"><span>    25: iload 5        // load i</span></span>
<span class="line"><span>    27: aload_3        // load a</span></span>
<span class="line"><span>    28: arraylength    // a.length</span></span>
<span class="line"><span>    29: if_icmplt 9    // i &amp;lt; a.length</span></span>
<span class="line"><span>// 循环体结束</span></span>
<span class="line"><span>    32: iload 4</span></span>
<span class="line"><span>    34: ireturn</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，在上面这段代码中，循环体中的表达式<code>x*y</code>，以及循环判断条件中的<code>a.length</code>均属于循环不变代码。前者是一个整数乘法运算，而后者则是内存访问操作，读取数组对象<code>a</code>的长度。（数组的长度存放于数组对象的对象头中，可通过arraylength指令来访问。）</p><p>理想情况下，上面这段代码经过循环无关代码外提之后，等同于下面这一手工优化版本。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int fooManualOpt(int x, int y, int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  int t0 = x * y;</span></span>
<span class="line"><span>  int t1 = a.length;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; t1; i++) {</span></span>
<span class="line"><span>    sum += t0 + a[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以看到，无论是乘法运算<code>x*y</code>，还是内存访问<code>a.length</code>，现在都在循环之前完成。原本循环中需要执行这两个表达式的地方，现在直接使用循环之前这两个表达式的执行结果。</p><p>在Sea-of-Nodes IR的帮助下，循环无关代码外提的实现并不复杂。</p><img src="https://static001.geekbang.org/resource/image/69/e6/6963da28cb3cf42cc43e4268a8f002e6.png" alt=""><p>上图我截取了Graal为前面例子中的<code>foo</code>方法所生成的IR图（局部）。其中B2基本块位于循环之前，B3基本块为循环头。</p><p><code>x*y</code>所对应的21号乘法节点，以及<code>a.length</code>所对应的47号读取节点，均不依赖于循环体中生成的数据，而且都为浮动节点。节点调度算法会将它们放置于循环之前的B2基本块中，从而实现这些循环无关代码的外提。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>0x02f0: mov edi,ebx  // ebx存放着x*y的结果</span></span>
<span class="line"><span>0x02f2: add edi,DWORD PTR [r8+r9*4+0x10]</span></span>
<span class="line"><span>                     // [r8+r9*4+0x10]即a[i]</span></span>
<span class="line"><span>                     // r8指向a，r9d存放着i</span></span>
<span class="line"><span>0x02f7: add eax,edi  // eax存放着sum</span></span>
<span class="line"><span>0x02f9: inc r9d      // i++</span></span>
<span class="line"><span>0x02fc: cmp r9d,r10d // i &amp;lt; a.length</span></span>
<span class="line"><span>                     // r10d存放着a.length</span></span>
<span class="line"><span>0x02ff: jl 0x02f0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这段机器码是<code>foo</code>方法的编译结果中的循环。这里面没有整数乘法指令，也没有读取数组长度的内存访问指令。它们的值已在循环之前计算好了，并且分别保存在寄存器<code>ebx</code>以及<code>r10d</code>之中。在循环之中，代码直接使用寄存器<code>ebx</code>以及<code>r10d</code>所保存的值，而不用在循环中反复计算。</p><p>从生成的机器码中可以看出，除了<code>x*y</code>和<code>a.length</code>的外提之外，即时编译器还外提了int数组加载指令<code>iaload</code>所暗含的null检测（null check）以及下标范围检测（range check）。</p><p>如果将<code>iaload</code>指令想象成一个接收数组对象以及下标作为参数，并且返回对应数组元素的方法，那么它的伪代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int iaload(int[] arrayRef, int index) {</span></span>
<span class="line"><span>  if (arrayRef == null) { // null检测</span></span>
<span class="line"><span>    throw new NullPointerException();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (index &amp;lt; 0 || index &amp;gt;= arrayRef.length) { // 下标范围检测</span></span>
<span class="line"><span>    throw new ArrayIndexOutOfBoundsException();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return arrayRef[index];</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>foo</code>方法中的null检测属于循环无关代码。这是因为它始终检测作为输入参数的int数组是否为null，而这与第几次循环无关。</p><p>为了更好地阐述具体的优化，我精简了原来的例子，并将<code>iaload</code>展开，最终形成如下所示的代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>    if (a == null) { // null check</span></span>
<span class="line"><span>      throw new NullPointerException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (i &amp;lt; 0 || i &amp;gt;= a.length) { // range check</span></span>
<span class="line"><span>      throw new ArrayIndexOutOfBoundsException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    sum += a[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这段代码中，null检测涉及了控制流依赖，因而无法通过Sea-of-Nodes IR转换以及节点调度来完成外提。</p><p>在C2中，null检测的外提是通过额外的编译优化，也就是循环预测（Loop Prediction，对应虚拟机参数<code>-XX:+UseLoopPredicate</code>）来实现的。该优化的实际做法是在循环之前插入同样的检测代码，并在命中的时候进行去优化。这样一来，循环中的检测代码便会被归纳并消除掉。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  if (a == null) {</span></span>
<span class="line"><span>    deoptimize(); // never returns</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>    if (a == null) { // now evluate to false</span></span>
<span class="line"><span>      throw new NullPointerException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (i &amp;lt; 0 || i &amp;gt;= a.length) { // range check</span></span>
<span class="line"><span>      throw new ArrayIndexOutOfBoundsException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    sum += a[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了null检测之外，其他循环无关检测都能够按照这种方式外提至循环之前。甚至是循环有关的下标范围检测，都能够借助循环预测来外提，只不过具体的转换要复杂一些。</p><p>之所以说下标范围检测是循环有关的，是因为在我们的例子中，该检测的主体是循环控制变量<code>i</code>（检测它是否在<code>[0, a.length)</code>之间），它的值将随着循环次数的增加而改变。</p><p>由于外提该下标范围检测之后，我们无法再引用到循环变量<code>i</code>，因此，即时编译器需要转换检测条件。具体的转换方式如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for (int i = INIT; i &amp;lt; LIMIT; i += STRIDE) {</span></span>
<span class="line"><span>  if (i &amp;lt; 0 || i &amp;gt;= a.length) { // range check</span></span>
<span class="line"><span>    throw new ArrayIndexOutOfBoundsException();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  sum += a[i];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>----------</span></span>
<span class="line"><span>// 经过下标范围检测外提之后：</span></span>
<span class="line"><span>if (INIT &amp;lt; 0 || IMAX &amp;gt;= a.length) {</span></span>
<span class="line"><span>  // IMAX是i所能达到的最大值，注意它不一定是LIMIT-1</span></span>
<span class="line"><span>  detopimize(); // never returns</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>for (int i = INIT; i &amp;lt; LIMIT; i += STRIDE) {</span></span>
<span class="line"><span>  sum += a[i]; // 不包含下标范围检测</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="循环展开" tabindex="-1"><a class="header-anchor" href="#循环展开"><span>循环展开</span></a></h2><p>另外一项非常重要的循环优化是循环展开（Loop Unrolling）。它指的是在循环体中重复多次循环迭代，并减少循环次数的编译优化。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; 64; i++) {</span></span>
<span class="line"><span>    sum += (i % 2 == 0) ? a[i] : -a[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，上面的代码经过一次循环展开之后将形成下面的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; 64; i += 2) { // 注意这里的步数是2</span></span>
<span class="line"><span>    sum += (i % 2 == 0) ? a[i] : -a[i];</span></span>
<span class="line"><span>    sum += ((i + 1) % 2 == 0) ? a[i + 1] : -a[i + 1];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在C2中，只有计数循环（Counted Loop）才能被展开。所谓的计数循环需要满足如下四个条件。</p><ol><li>维护一个循环计数器，并且基于计数器的循环出口只有一个（但可以有基于其他判断条件的出口）。</li><li>循环计数器的类型为int、short或者char（即不能是byte、long，更不能是float或者double）。</li><li>每个迭代循环计数器的增量为常数。</li><li>循环计数器的上限（增量为正数）或下限（增量为负数）是循环无关的数值。</li></ol><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for (int i = START; i &amp;lt; LIMIT; i += STRIDE) { .. }</span></span>
<span class="line"><span>// 等价于</span></span>
<span class="line"><span>int i = START;</span></span>
<span class="line"><span>while (i &amp;lt; LIMIT) {</span></span>
<span class="line"><span>  ..</span></span>
<span class="line"><span>  i += STRIDE;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面两种循环中，只要<code>LIMIT</code>是循环无关的数值，<code>STRIDE</code>是常数，而且循环中除了<code>i &amp;lt; LIMIT</code>之外没有其他基于循环变量<code>i</code>的循环出口，那么C2便会将该循环识别为计数循环。</p><p>循环展开的缺点显而易见：它可能会增加代码的冗余度，导致所生成机器码的长度大幅上涨。</p><p>不过，随着循环体的增大，优化机会也会不断增加。一旦循环展开能够触发进一步的优化，总体的代码复杂度也将降低。比如前面的例子经过循环展开之后便可以进一步优化为如下所示的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; 64; i += 2) {</span></span>
<span class="line"><span>    sum += a[i];</span></span>
<span class="line"><span>    sum += -a[i + 1];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>循环展开有一种特殊情况，那便是完全展开（Full Unroll）。当循环的数目是固定值而且非常小时，即时编译器会将循环全部展开。此时，原本循环中的循环判断语句将不复存在，取而代之的是若干个顺序执行的循环体。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; 4; i++) {</span></span>
<span class="line"><span>    sum += a[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，上述代码将被完全展开为下述代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  sum += a[0];</span></span>
<span class="line"><span>  sum += a[1];</span></span>
<span class="line"><span>  sum += a[2];</span></span>
<span class="line"><span>  sum += a[3];</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即时编译器会在循环体的大小与循环展开次数之间做出权衡。例如，对于仅迭代三次（或以下）的循环，即时编译器将进行完全展开；对于循环体IR节点数目超过阈值的循环，即时编译器则不会进行任何循环展开。</p><h2 id="其他循环优化" tabindex="-1"><a class="header-anchor" href="#其他循环优化"><span>其他循环优化</span></a></h2><p>除了循环无关代码外提以及循环展开之外，即时编译器还有两个比较重要的循环优化技术：循环判断外提（loop unswitching）以及循环剥离（loop peeling）。</p><p>循环判断外提指的是将循环中的if语句外提至循环之前，并且在该if语句的两个分支中分别放置一份循环代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>    if (a.length &amp;gt; 4) {</span></span>
<span class="line"><span>      sum += a[i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，上面这段代码经过循环判断外提之后，将变成下面这段代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  if (a.length &amp;gt; 4) {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>      sum += a[i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 进一步优化为：</span></span>
<span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  if (a.length &amp;gt; 4) {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>      sum += a[i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>循环判断外提与循环无关检测外提所针对的代码模式比较类似，都是循环中的if语句。不同的是，后者在检查失败时会抛出异常，中止当前的正常执行路径；而前者所针对的是更加常见的情况，即通过if语句的不同分支执行不同的代码逻辑。</p><p>循环剥离指的是将循环的前几个迭代或者后几个迭代剥离出循环的优化方式。一般来说，循环的前几个迭代或者后几个迭代都包含特殊处理。通过将这几个特殊的迭代剥离出去，可以使原本的循环体的规律性更加明显，从而触发进一步的优化。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int j = 0;</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>    sum += a[j];</span></span>
<span class="line"><span>    j = i;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，上面这段代码剥离了第一个迭代后，将变成下面这段代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int foo(int[] a) {</span></span>
<span class="line"><span>  int sum = 0;</span></span>
<span class="line"><span>  if (0 &amp;lt; a.length) {</span></span>
<span class="line"><span>    sum += a[0];</span></span>
<span class="line"><span>    for (int i = 1; i &amp;lt; a.length; i++) {</span></span>
<span class="line"><span>      sum += a[i - 1];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return sum;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结与实践" tabindex="-1"><a class="header-anchor" href="#总结与实践"><span>总结与实践</span></a></h2><p>今天我介绍了即时编译器所使用的循环优化。</p><p>循环无关代码外提将循环中值不变的表达式，或者循环无关检测外提至循环之前，以避免在循环中重复进行冗余计算。前者是通过Sea-of-Nodes IR以及节点调度来共同完成的，而后者则是通过一个独立优化 —— 循环预测来完成的。循环预测还可以外提循环有关的数组下标范围检测。</p><p>循环展开是一种在循环中重复多次迭代，并且相应地减少循环次数的优化方式。它是一种以空间换时间的优化方式，通过增大循环体来获取更多的优化机会。循环展开的特殊形式是完全展开，将原本的循环转换成若干个循环体的顺序执行。</p><p>此外，我还简单地介绍了另外两种循环优化方式：循环判断外提以及循环剥离。</p><p>今天的实践环节，我们来看这么一段代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>void foo(byte[] dst, byte[] src) {</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; dst.length; i++) {</span></span>
<span class="line"><span>    dst[i] = src[i];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这段代码经过循环展开变成下面这段代码。请问你能想到进一步优化的机会吗？<br><br> （提示：数组元素在内存中的分布是连续的。假设<code>dst[0]</code>位于0x1000，那么<code>dst[1]</code>位于0x1001。）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>void foo(byte[] dst, byte[] src) {</span></span>
<span class="line"><span>  for (int i = 0; i &amp;lt; dst.length - 4; i += 4) {</span></span>
<span class="line"><span>    dst[i] = src[i];</span></span>
<span class="line"><span>    dst[i + 1] = src[i + 1];</span></span>
<span class="line"><span>    dst[i + 2] = src[i + 2];</span></span>
<span class="line"><span>    dst[i + 3] = src[i + 3];</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ... // post-loop</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,67)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/%E6%A8%A1%E5%9D%97%E4%B8%89%EF%BC%9A%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96/25%20_%20%E5%BE%AA%E7%8E%AF%E4%BC%98%E5%8C%96.html","title":"25 _ 循环优化","lang":"zh-CN","frontmatter":{"description":"25 _ 循环优化 在许多应用程序中，循环都扮演着非常重要的角色。为了提升循环的运行效率，研发编译器的工程师提出了不少面向循环的编译优化方式，如循环无关代码外提，循环展开等。 今天，我们便来了解一下，Java虚拟机中的即时编译器都应用了哪些面向循环的编译优化。 循环无关代码外提 所谓的循环无关代码（Loop-invariant Code），指的是循环中...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/%E6%A8%A1%E5%9D%97%E4%B8%89%EF%BC%9A%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96/25%20_%20%E5%BE%AA%E7%8E%AF%E4%BC%98%E5%8C%96.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"25 _ 循环优化"}],["meta",{"property":"og:description","content":"25 _ 循环优化 在许多应用程序中，循环都扮演着非常重要的角色。为了提升循环的运行效率，研发编译器的工程师提出了不少面向循环的编译优化方式，如循环无关代码外提，循环展开等。 今天，我们便来了解一下，Java虚拟机中的即时编译器都应用了哪些面向循环的编译优化。 循环无关代码外提 所谓的循环无关代码（Loop-invariant Code），指的是循环中..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"25 _ 循环优化\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":11.3,"words":3390},"filePathRelative":"posts/深入拆解Java虚拟机/模块三：代码优化/25 _ 循环优化.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"25 | 循环优化\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/7e/67/7ed655e74b24aa5c935f328a6fc70167.mp3\\"></audio></p>\\n<p>在许多应用程序中，循环都扮演着非常重要的角色。为了提升循环的运行效率，研发编译器的工程师提出了不少面向循环的编译优化方式，如循环无关代码外提，循环展开等。</p>\\n<p>今天，我们便来了解一下，Java虚拟机中的即时编译器都应用了哪些面向循环的编译优化。</p>","autoDesc":true}');export{t as comp,v as data};
