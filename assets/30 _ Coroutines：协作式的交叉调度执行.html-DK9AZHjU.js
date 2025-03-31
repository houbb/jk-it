import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const l={};function p(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="30 | Coroutines：协作式的交叉调度执行" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/b2/ee/b233b80aa52a63b9b45756145ea910ee.mp3"></audio></p><p>你好，我是吴咏炜。</p><p>今天是我们未来篇的最后一讲，也是这个专栏正文内容的最后一篇了。我们讨论 C++20 里的又一个非常重要的新功能——协程 Coroutines。</p><h2 id="什么是协程" tabindex="-1"><a class="header-anchor" href="#什么是协程"><span>什么是协程？</span></a></h2><p>协程是一个很早就被提出的编程概念。根据高德纳的描述，协程的概念在 1958 年就被提出了。不过，它在主流编程语言中得到的支持不那么好，因而你很可能对它并不熟悉吧。</p><p>如果查阅维基百科，你可以看到下面这样的定义 [1]：</p><blockquote></blockquote><p>协程是计算机程序的⼀类组件，推⼴了协作式多任务的⼦程序，允许执⾏被挂起与被恢复。相对⼦例程⽽⾔，协程更为⼀般和灵活……</p><p>等学完了这一讲，也许你可以明白这段话的意思。但对不了解协程的人来说，估计只能吐槽一句了，这是什么鬼？</p><img src="https://static001.geekbang.org/resource/image/4d/f9/4d4fb4a1c16edb1087d934cd1bb7eef9.png" alt="" title="图片源自网络"><p>很遗憾，在 C++ 里的标准协程有点小复杂。我们还是从……Python 开始。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>def fibonacci():</span></span>
<span class="line"><span>    a = 0</span></span>
<span class="line"><span>    b = 1</span></span>
<span class="line"><span>    while True:</span></span>
<span class="line"><span>        yield b</span></span>
<span class="line"><span>        a, b = b, a + b</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即使你没学过 Python，上面这个生成斐波那契数列的代码应该也不难理解。唯一看起来让人会觉得有点奇怪的应该就是那个 <code>yield</code> 了。这种写法在 Python 里叫做“生成器”（generator），返回的是一个可迭代的对象，每次迭代就能得到一个 yield 出来的结果。这就是一种很常见的协程形式了。</p><p>如何使用这个生成器，请看下面的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># 打印头 20 项</span></span>
<span class="line"><span>for i in islice(fibonacci(), 20):</span></span>
<span class="line"><span>    print(i)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 打印小于 10000 的数列项</span></span>
<span class="line"><span>for i in takewhile(</span></span>
<span class="line"><span>        lambda x: x &amp;lt; 10000,</span></span>
<span class="line"><span>        fibonacci()):</span></span>
<span class="line"><span>    print(i)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这些代码很容易理解：<code>islice</code> 相当于<a href="https://time.geekbang.org/column/article/195553" target="_blank" rel="noopener noreferrer">[第 29 讲]</a> 中的 <code>take</code>，取一个范围的头若干项；<code>takewhile</code> 则在范围中逐项取出内容，直到第一个参数的条件不能被满足。两个函数的结果都可以被看作是 C++ 中的视图。</p><p>我们唯一需要提的是，在代码的执行过程中，<code>fibonacci</code> 和它的调用代码是交叉执行的。下面我们用代码行加注释的方式标一下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>a = 0  # fibonacci()</span></span>
<span class="line"><span>b = 0  # fibonacci()</span></span>
<span class="line"><span>yield b  # fibonacci()</span></span>
<span class="line"><span>print(i)  # 调用者</span></span>
<span class="line"><span>a, b = 1, 0 + 1  # fibonacci()</span></span>
<span class="line"><span>yield b  # fibonacci()</span></span>
<span class="line"><span>print(i)  # 调用者</span></span>
<span class="line"><span>a, b = 1, 1 + 1  # fibonacci()</span></span>
<span class="line"><span>yield b  # fibonacci()</span></span>
<span class="line"><span>print(i)  # 调用者</span></span>
<span class="line"><span>a, b = 2, 1 + 2  # fibonacci()</span></span>
<span class="line"><span>yield b  # fibonacci()</span></span>
<span class="line"><span>print(i)  # 调用者</span></span>
<span class="line"><span>…</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>学到这儿的同学应该都知道我们在 C++ 里怎么完成类似的功能吧？我就不讲解了，直接给出可工作的代码。这是对应的 <code>fibonacci</code> 的定义：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iterator&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stddef.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdint.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class fibonacci {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  class sentinel;</span></span>
<span class="line"><span>  class iterator;</span></span>
<span class="line"><span>  iterator begin() noexcept;</span></span>
<span class="line"><span>  sentinel end() noexcept;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class fibonacci::sentinel {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class fibonacci::iterator {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  // Required to satisfy iterator</span></span>
<span class="line"><span>  // concept</span></span>
<span class="line"><span>  typedef ptrdiff_t difference_type;</span></span>
<span class="line"><span>  typedef uint64_t value_type;</span></span>
<span class="line"><span>  typedef const uint64_t* pointer;</span></span>
<span class="line"><span>  typedef const uint64_t&amp;amp; reference;</span></span>
<span class="line"><span>  typedef std::input_iterator_tag</span></span>
<span class="line"><span>    iterator_category;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  value_type operator*() const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return b_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  pointer operator-&amp;gt;() const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return &amp;amp;b_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  iterator&amp;amp; operator++()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    auto tmp = a_;</span></span>
<span class="line"><span>    a_ = b_;</span></span>
<span class="line"><span>    b_ += tmp;</span></span>
<span class="line"><span>    return *this;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  iterator operator++(int)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    auto tmp = *this;</span></span>
<span class="line"><span>    ++*this;</span></span>
<span class="line"><span>    return tmp;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  bool</span></span>
<span class="line"><span>  operator==(const sentinel&amp;amp;) const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  bool</span></span>
<span class="line"><span>  operator!=(const sentinel&amp;amp;) const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  uint64_t a_{0};</span></span>
<span class="line"><span>  uint64_t b_{1};</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// sentinel needs to be</span></span>
<span class="line"><span>// equality_comparable_with iterator</span></span>
<span class="line"><span>bool operator==(</span></span>
<span class="line"><span>  const fibonacci::sentinel&amp;amp; lhs,</span></span>
<span class="line"><span>  const fibonacci::iterator&amp;amp; rhs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  return rhs == lhs;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>bool operator!=(</span></span>
<span class="line"><span>  const fibonacci::sentinel&amp;amp; lhs,</span></span>
<span class="line"><span>  const fibonacci::iterator&amp;amp; rhs)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  return rhs != lhs;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>inline fibonacci::iterator</span></span>
<span class="line"><span>fibonacci::begin() noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  return iterator();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>inline fibonacci::sentinel</span></span>
<span class="line"><span>fibonacci::end() noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  return sentinel();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用代码跟 Python 的相似：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 打印头 20 项</span></span>
<span class="line"><span>for (auto i :</span></span>
<span class="line"><span>     fibonacci() | take(20)) {</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; i &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 打印小于 10000 的数列项</span></span>
<span class="line"><span>for (auto i :</span></span>
<span class="line"><span>     fibonacci() |</span></span>
<span class="line"><span>       take_while([](uint64_t x) {</span></span>
<span class="line"><span>         return x &amp;lt; 10000;</span></span>
<span class="line"><span>       })) {</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; i &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这似乎还行。但 <code>fibonacci</code> 的定义差异就大了：在 Python 里是 6 行有效代码，在 C++ 里是 53 行。C++ 的生产率似乎有点低啊……</p><h2 id="c-20-协程" tabindex="-1"><a class="header-anchor" href="#c-20-协程"><span>C++20 协程</span></a></h2><p>C++20 协程的基础是微软提出的 Coroutines TS（可查看工作草案 [2]），它在 2019 年 7 月被批准加入到 C++20 草案中。目前，MSVC 和 Clang 已经支持协程。不过，需要提一下的是，目前被标准化的只是协程的底层语言支持，而不是上层的高级封装；稍后，我们会回到这个话题。</p><p>协程可以有很多不同的用途，下面列举了几种常见情况：</p><ul><li>生成器</li><li>异步 I/O</li><li>惰性求值</li><li>事件驱动应用</li></ul><p>这一讲中，我们主要还是沿用生成器的例子，向你展示协程的基本用法。异步 I/O 应当在协程得到广泛采用之后，成为最能有明显收益的使用场景；但目前，就我看到的，只有 Windows 平台上有较好的支持——微软目前还是做了很多努力的。</p><p>回到 Coroutines。我们今天采用 Coroutines TS 中的写法，包括 <code>std::experimental</code> 名空间，以确保你可以在 MSVC 和 Clang 下编译代码。首先，我们看一下协程相关的新关键字，有下面三个：</p><ul><li><code>co_await</code></li><li><code>co_yield</code></li><li><code>co_return</code></li></ul><p>这三个关键字最初是没有 <code>co_</code> 前缀的，但考虑到 <code>await</code>、<code>yield</code> 已经在很多代码里出现，就改成了目前这个样子。同时，<code>return</code> 和 <code>co_return</code> 也作出了明确的区分：一个协程里只能使用 <code>co_return</code>，不能使用 <code>return</code>。这三个关键字只要有一个出现在函数中，这个函数就是一个协程了——从外部则看不出来，没有用其他语言常用的 <code>async</code> 关键字来标记（<code>async</code> 也已经有其他用途了，见<a href="https://time.geekbang.org/column/article/186689" target="_blank" rel="noopener noreferrer">[第 19 讲]</a>）。C++ 认为一个函数是否是一个协程是一个实现细节，不是对外接口的一部分。</p><p>我们看一下用协程实现的 <code>fibonacci</code> 长什么样子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>uint64_resumable fibonacci()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  uint64_t a = 0;</span></span>
<span class="line"><span>  uint64_t b = 1;</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    co_yield b;</span></span>
<span class="line"><span>    auto tmp = a;</span></span>
<span class="line"><span>    a = b;</span></span>
<span class="line"><span>    b += tmp;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个形式跟 Python 的非常相似了吧，也非常简洁。我们稍后再讨论 <code>uint64_resumable</code> 的定义，先看一下调用代码的样子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>auto res = fibonacci();</span></span>
<span class="line"><span>while (res.resume()) {</span></span>
<span class="line"><span>  auto i = res.get();</span></span>
<span class="line"><span>  if (i &amp;gt;= 10000) {</span></span>
<span class="line"><span>    break;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; i &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个代码也非常简单，但我们需要留意 <code>resume</code> 和 <code>get</code> 两个函数调用——这就是我们的 <code>uint64_resumable</code> 类型需要提供的接口了。</p><h3 id="co-await、co-yield、co-return-和协程控制" tabindex="-1"><a class="header-anchor" href="#co-await、co-yield、co-return-和协程控制"><span>co_await、co_yield、co_return 和协程控制</span></a></h3><p>在讨论该如何定义 <code>uint64_resumable</code> 之前，我们需要先讨论一下协程的这三个新关键字。</p><p>首先是 <code>co_await</code>。对于下面这样一个表达式：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>auto result = co_await 表达式;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>编译器会把它理解为：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>auto&amp;amp;&amp;amp; __a = 表达式;</span></span>
<span class="line"><span>if (!__a.await_ready()) {</span></span>
<span class="line"><span>  __a.await_suspend(协程句柄);</span></span>
<span class="line"><span>  // 挂起/恢复点</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>auto result = __a.await_resume();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说，“表达式”需要支持 <code>await_ready</code>、<code>await_suspend</code> 和 <code>await_resume</code> 三个接口。如果 <code>await_ready()</code> 返回真，就代表不需要真正挂起，直接返回后面的结果就可以；否则，执行 <code>await_suspend</code> 之后即挂起协程，等待协程被唤醒之后再返回 <code>await_resume()</code> 的结果。这样一个表达式被称作是个 awaitable。</p><p>标准里定义了两个 awaitable，如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct suspend_always {</span></span>
<span class="line"><span>  bool await_ready() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  void await_suspend(</span></span>
<span class="line"><span>    coroutine_handle&amp;lt;&amp;gt;)</span></span>
<span class="line"><span>    const noexcept {}</span></span>
<span class="line"><span>  void await_resume()</span></span>
<span class="line"><span>    const noexcept {}</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct suspend_never {</span></span>
<span class="line"><span>  bool await_ready() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  void await_suspend(</span></span>
<span class="line"><span>    coroutine_handle&amp;lt;&amp;gt;)</span></span>
<span class="line"><span>    const noexcept {}</span></span>
<span class="line"><span>  void await_resume()</span></span>
<span class="line"><span>    const noexcept {}</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说，<code>suspend_always</code> 永远告诉调用者需要挂起，而 <code>suspend_never</code> 则永远告诉调用者不需要挂起。两者的 <code>await_suspend</code> 和 <code>await_resume</code> 都是平凡实现，不做任何实际的事情。一个 awaitable 可以自行实现这些接口，以定制挂起之前和恢复之后需要执行的操作。</p><p>上面的 <code>coroutine_handle</code> 是 C++ 标准库提供的类模板。这个类是用户代码跟系统协程调度真正交互的地方，有下面这些成员函数我们等会就会用到：</p><ul><li><code>destroy</code>：销毁协程</li><li><code>done</code>：判断协程是否已经执行完成</li><li><code>resume</code>：让协程恢复执行</li><li><code>promise</code>：获得协程相关的 promise 对象（和<a href="https://time.geekbang.org/column/article/186689" target="_blank" rel="noopener noreferrer">[第 19 讲]</a> 中的“承诺量”有点相似，是协程和调用者的主要交互对象；一般类型名称为 <code>promise_type</code>）</li><li><code>from_promise</code>（静态）：通过 promise 对象的引用来生成一个协程句柄</li></ul><p>协程的执行过程大致是这个样子的：</p><ol><li>为协程调用分配一个协程帧，含协程调用的参数、变量、状态、promise 对象等所需的空间。</li><li>调用 <code>promise.get_return_object()</code>，返回值会在协程第一次挂起时返回给协程的调用者。</li><li>执行 <code>co_await promise.initial_suspsend()</code>；根据上面对 <code>co_await</code> 语义的描述，协程可能在此第一次挂起（但也可能此时不挂起，在后面的协程体执行过程中挂起）。</li><li>执行协程体中的语句，中间可能有挂起和恢复；如果期间发生异常没有在协程体中处理，则调用 <code>promise.unhandled_exception()</code>。</li><li>当协程执行到底，或者执行到 <code>co_return</code> 语句时，会根据是否有非 void 的返回值，调用 <code>promise.return_value(…)</code> 或 <code>promise.return_void()</code>，然后执行 <code>co_await promise.final_suspsend()</code>。</li></ol><p>用代码可以大致表示如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  frame = operator new(…);</span></span>
<span class="line"><span>  promise_type&amp;amp; promise =</span></span>
<span class="line"><span>    frame-&amp;gt;promise;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 在初次挂起时返回给调用者</span></span>
<span class="line"><span>  auto return_value =</span></span>
<span class="line"><span>    promise.get_return_object();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  co_await promise</span></span>
<span class="line"><span>    .initial_suspsend();</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    执行协程体;</span></span>
<span class="line"><span>    可能被 co_wait、co_yield 挂起;</span></span>
<span class="line"><span>    恢复后继续执行，直到 co_return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (...) {</span></span>
<span class="line"><span>    promise.unhandled_exception();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>final_suspend:</span></span>
<span class="line"><span>  co_await promise.final_suspsend();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面描述了 <code>co_await</code> 和 <code>co_return</code>，那 <code>co_yield</code> 呢？也很简单，<code>co_yield 表达式</code> 等价于：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>co_await promise.yield_value(表达式);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="定义-uint64-resumable" tabindex="-1"><a class="header-anchor" href="#定义-uint64-resumable"><span>定义 <code>uint64_resumable</code></span></a></h3><p>了解了上述知识之后，我们就可以展示一下 <code>uint64_resumable</code> 的定义了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class uint64_resumable {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  struct promise_type {…};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  using coro_handle =</span></span>
<span class="line"><span>    coroutine_handle&amp;lt;promise_type&amp;gt;;</span></span>
<span class="line"><span>  explicit uint64_resumable(</span></span>
<span class="line"><span>    coro_handle handle)</span></span>
<span class="line"><span>    : handle_(handle)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ~uint64_resumable()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    handle_.destroy();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  uint64_resumable(</span></span>
<span class="line"><span>    const uint64_resumable&amp;amp;) =</span></span>
<span class="line"><span>    delete;</span></span>
<span class="line"><span>  uint64_resumable(</span></span>
<span class="line"><span>    uint64_resumable&amp;amp;&amp;amp;) = default;</span></span>
<span class="line"><span>  bool resume();</span></span>
<span class="line"><span>  uint64_t get();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  coro_handle handle_;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个代码相当简单，我们的结构内部有个 <code>promise_type</code>（下面会定义），而私有成员只有一个协程句柄。协程构造需要一个协程句柄，析构时将使用协程句柄来销毁协程；为简单起见，我们允许结构被移动，但不可复制（以免重复调用 <code>handle_.destroy()</code>）。除此之外，我们这个结构只提供了调用者需要的 <code>resume</code> 和 <code>get</code> 成员函数，分别定义如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>bool uint64_resumable::resume()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  if (!handle_.done()) {</span></span>
<span class="line"><span>    handle_.resume();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return !handle_.done();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint64_t uint64_resumable::get()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  return handle_.promise().value_;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说，<code>resume</code> 会判断协程是否已经结束，没结束就恢复协程的执行；当协程再次挂起时（调用者恢复执行），返回协程是否仍在执行中的状态。而 <code>get</code> 简单地返回存储在 promise 对象中的数值。</p><p>现在我们需要看一下 promise 类型了，它里面有很多协程的定制点，可以修改协程的行为：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct promise_type {</span></span>
<span class="line"><span>  uint64_t value_;</span></span>
<span class="line"><span>  using coro_handle =</span></span>
<span class="line"><span>    coroutine_handle&amp;lt;promise_type&amp;gt;;</span></span>
<span class="line"><span>  auto get_return_object()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return uint64_resumable{</span></span>
<span class="line"><span>      coro_handle::from_promise(</span></span>
<span class="line"><span>        *this)};</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  constexpr auto initial_suspend()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return suspend_always();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  constexpr auto final_suspend()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return suspend_always();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  auto yield_value(uint64_t value)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    value_ = value;</span></span>
<span class="line"><span>    return suspend_always();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  void return_void() {}</span></span>
<span class="line"><span>  void unhandled_exception()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    std::terminate();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简单解说一下：</p><ul><li>结构里面只有一个数据成员 <code>value_</code>，存放供 <code>uint64_resumable::get</code> 取用的数值。</li><li><code>get_return_object</code> 是第一个定制点。我们前面提到过，调用协程的返回值就是 <code>get_return_object()</code> 的结果。我们这儿就是使用 promise 对象来构造一个 <code>uint64_resumable</code>。</li><li><code>initial_suspend</code> 是第二个定制点。我们此处返回 <code>suspend_always()</code>，即协程立即挂起，调用者马上得到 <code>get_return_object()</code> 的结果。</li><li><code>final_suspend</code> 是第三个定制点。我们此处返回 <code>suspend_always()</code>，即使执行到了 <code>co_return</code> 语句，协程仍处于挂起状态。如果我们返回 <code>suspend_never()</code> 的话，那一旦执行了 <code>co_return</code> 或执行到协程结束，协程就会被销毁，连同已初始化的本地变量和 promise，并释放协程帧内存。</li><li><code>yield_value</code> 是第四个定制点。我们这儿仅对 <code>value_</code> 进行赋值，然后让协程挂起（执行控制回到调用者）。</li><li><code>return_void</code> 是第五个定制点。我们的代码永不返回，这儿无事可做。</li><li><code>unhandled_exception</code> 是第六个定制点。我们这儿也不应该发生任何异常，所以我们简单地调用 <code>terminate</code> 来终结程序的执行。</li></ul><p>好了，这样，我们就完成了协程相关的所有定义。有没有觉得轻松点？</p><p>没有？那就对了。正如我在这一节开头说的，C++20 标准化的只是协程的底层语言支持（我上面还并不是一个非常完整的描述）。要用这些底层直接写应用代码，那是非常痛苦的事。这些接口的目标用户实际上也不是普通开发者，而是库的作者。</p><p>幸好，我们并不是没有任何高层抽象，虽然这些实现不“标准”。</p><h2 id="c-20-协程的高层抽象" tabindex="-1"><a class="header-anchor" href="#c-20-协程的高层抽象"><span>C++20 协程的高层抽象</span></a></h2><h3 id="cppcoro" tabindex="-1"><a class="header-anchor" href="#cppcoro"><span>cppcoro</span></a></h3><p>我们首先看一下跨平台的 cppcoro 库 [3]，它提供的高层接口就包含了 <code>generator</code>。如果使用 cppcoro，我们的 <code>fibonacci</code> 协程可以这样实现：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;cppcoro/generator.hpp&amp;gt;</span></span>
<span class="line"><span>using cppcoro::generator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>generator&amp;lt;uint64_t&amp;gt; fibonacci()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  uint64_t a = 0;</span></span>
<span class="line"><span>  uint64_t b = 1;</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    co_yield b;</span></span>
<span class="line"><span>    auto tmp = a;</span></span>
<span class="line"><span>    a = b;</span></span>
<span class="line"><span>    b += tmp;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 <code>fibonacci</code> 也比刚才的代码要方便：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for (auto i : fibonacci()) {</span></span>
<span class="line"><span>  if (i &amp;gt;= 10000) {</span></span>
<span class="line"><span>    break;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; i &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了生成器，cppcoro 还支持异步任务和异步 I/O——遗憾的是，异步 I/O 目前只有 Windows 平台上有，还没人实现 Linux 或 macOS 上的支持。</p><h3 id="msvc" tabindex="-1"><a class="header-anchor" href="#msvc"><span>MSVC</span></a></h3><p>作为协程的先行者和 Coroutines TS 的提出者，微软在协程上做了很多工作。生成器当然也在其中：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;experimental/generator&amp;gt;</span></span>
<span class="line"><span>using std::experimental::generator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>generator&amp;lt;uint64_t&amp;gt; fibonacci()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  uint64_t a = 0;</span></span>
<span class="line"><span>  uint64_t b = 1;</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    co_yield b;</span></span>
<span class="line"><span>    auto tmp = a;</span></span>
<span class="line"><span>    a = b;</span></span>
<span class="line"><span>    b += tmp;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>微软还有一些有趣的私有扩展。比如，MSVC 把标准 C++ 的 <code>future</code> 改造成了 awaitable。下面的代码在 MSVC 下可以编译通过，简单地展示了基本用法：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>future&amp;lt;int&amp;gt; compute_value()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int result = co_await async([] {</span></span>
<span class="line"><span>    this_thread::sleep_for(1s);</span></span>
<span class="line"><span>    return 42;</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  co_return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  auto value = compute_value();</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; value.get() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码中有一个地方我需要提醒一下：虽然上面 <code>async</code> 返回的是 <code>future&amp;lt;int&amp;gt;</code>，但 <code>compute_value</code> 的调用者得到的并不是这个 <code>future</code>——它得到的是另外一个独立的 <code>future</code>，并最终由 <code>co_return</code> 把结果数值填充了进去。</p><h2 id="有栈协程和无栈协程" tabindex="-1"><a class="header-anchor" href="#有栈协程和无栈协程"><span>有栈协程和无栈协程</span></a></h2><p>我们最后需要说一下有栈（stackful）协程和无栈（stackless）协程的区别。C++ 里很早就有了有栈的协程，概念上来讲，有栈的协程跟纤程、goroutines 基本是一个概念，都是由用户自行调度的、操作系统之外的运行单元。每个这样的运行单元都有自己独立的栈空间，缺点当然就是栈的空间占用和切换栈的开销了。而无栈的协程自己没有独立的栈空间，每个协程只需要一个很小的栈帧，空间占用小，也没有栈的切换开销。</p><p>C++20 的协程是无栈的。部分原因是有栈的协程可以使用纯库方式实现，而无栈的协程需要一点编译器魔法帮忙。毕竟，协程里面的变量都是要放到堆上而不是栈上的。</p><p>一个简单的无栈协程调用的内存布局如下图所示：</p><img src="https://static001.geekbang.org/resource/image/e3/66/e35d2b262c741acf40d69eedc6a5ad66.png" alt=""><p>可以看到，协程 C 本身的本地变量不占用栈，但当它调用其他函数时，它会使用线程原先的栈空间。在上面的函数 D 的执行过程中，协程是不可以挂起的——如果控制回到 B 继续，B 可能会使用目前已经被 D 使用的栈空间！</p><p>因此，无栈的协程牺牲了一定的灵活性，换来了空间的节省和性能。有栈的协程你可能起几千个就占用不少内存空间，而无栈的协程可以轻轻松松起到亿级——毕竟，维持基本状态的开销我实测下来只有一百字节左右。</p><p>反过来，如果无栈的协程不满足需要——比如，你的协程里需要有递归调用，并在深层挂起——你就不得不寻找一个有栈的协程的解决方案。目前已经有一些成熟的方案，比如 Boost.Coroutine2 [4]。下面的代码展示如何在 Boost.Coroutine2 里实现 <code>fibonacci</code>，让你感受一点点小区别：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdint.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/coroutine2/all.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef boost::coroutines2::</span></span>
<span class="line"><span>  coroutine&amp;lt;const uint64_t&amp;gt;</span></span>
<span class="line"><span>    coro_t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void fibonacci(</span></span>
<span class="line"><span>  coro_t::push_type&amp;amp; yield)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  uint64_t a = 0;</span></span>
<span class="line"><span>  uint64_t b = 1;</span></span>
<span class="line"><span>  while (true) {</span></span>
<span class="line"><span>    yield(b);</span></span>
<span class="line"><span>    auto tmp = a;</span></span>
<span class="line"><span>    a = b;</span></span>
<span class="line"><span>    b += tmp;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  for (auto i : coro_t::pull_type(</span></span>
<span class="line"><span>         boost::coroutines2::</span></span>
<span class="line"><span>           fixedsize_stack(),</span></span>
<span class="line"><span>         fibonacci)) {</span></span>
<span class="line"><span>    if (i &amp;gt;= 10000) {</span></span>
<span class="line"><span>      break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    std::cout &amp;lt;&amp;lt; i &amp;lt;&amp;lt; std::endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="编译器支持" tabindex="-1"><a class="header-anchor" href="#编译器支持"><span>编译器支持</span></a></h2><p>前面提到了，MSVC 和 Clang 目前支持协程。不过，它们都需要特殊的命令行选项来开启协程支持：</p><ul><li>MSVC 需要 <code>/await</code> 命令行选项</li><li>Clang 需要 <code>-fcoroutines-ts</code> 命令行选项</li></ul><p>为了满足使用 CMake 的同学的要求，也为了方便大家编译，我把示例代码放到了 GitHub 上：<a href="https://github.com/adah1972/geek_time_cpp" target="_blank" rel="noopener noreferrer">https://github.com/adah1972/geek_time_cpp</a></p><h2 id="内容小结" tabindex="-1"><a class="header-anchor" href="#内容小结"><span>内容小结</span></a></h2><p>本讲讨论了 C++20 里的第三个重要特性：协程。协程仍然很新，但它的重要性是毋庸置疑的——尤其在生成器和异步 I/O 上。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>请仔细比较第一个 <code>fibonacci</code> 的 C++ 实现和最后使用 <code>generator</code> 的 <code>fibonacci</code> 的实现，体会协程代码如果自行用状态机的方式来实现，是一件多麻烦的事情。</p><p>如果你对协程有兴趣，可以查看参考资料 [5]，里面提供了一些较为深入的原理介绍。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>[1] 维基百科, “协程”. <a href="https://zh.wikipedia.org/zh-cn/%E5%8D%8F%E7%A8%8B" target="_blank" rel="noopener noreferrer">https://zh.wikipedia.org/zh-cn/协程</a></p><p>[2] Gor Nishanov, “Working draft, C++ extensions for coroutines”. <a href="http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/n4775.pdf" target="_blank" rel="noopener noreferrer">http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/n4775.pdf</a></p><p>[3] Lewis Baker, CppCoro. <a href="https://github.com/lewissbaker/cppcoro" target="_blank" rel="noopener noreferrer">https://github.com/lewissbaker/cppcoro</a></p><p>[4] Oliver Kowalke, Boost.Coroutine2. <a href="https://www.boost.org/doc/libs/release/libs/coroutine2/doc/html/index.html" target="_blank" rel="noopener noreferrer">https://www.boost.org/doc/libs/release/libs/coroutine2/doc/html/index.html</a></p><p>[5] Dawid Pilarski, “Coroutines introduction”. <a href="https://blog.panicsoftware.com/coroutines-introduction/" target="_blank" rel="noopener noreferrer">https://blog.panicsoftware.com/coroutines-introduction/</a></p>`,104)]))}const t=n(l,[["render",p]]),o=JSON.parse('{"path":"/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E6%9C%AA%E6%9D%A5%E7%AF%87/30%20_%20Coroutines%EF%BC%9A%E5%8D%8F%E4%BD%9C%E5%BC%8F%E7%9A%84%E4%BA%A4%E5%8F%89%E8%B0%83%E5%BA%A6%E6%89%A7%E8%A1%8C.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是吴咏炜。 今天是我们未来篇的最后一讲，也是这个专栏正文内容的最后一篇了。我们讨论 C++20 里的又一个非常重要的新功能——协程 Coroutines。 什么是协程？ 协程是一个很早就被提出的编程概念。根据高德纳的描述，协程的概念在 1958 年就被提出了。不过，它在主流编程语言中得到的支持不那么好，因而你很可能对它并不熟悉吧。 如果查阅维基...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E6%9C%AA%E6%9D%A5%E7%AF%87/30%20_%20Coroutines%EF%BC%9A%E5%8D%8F%E4%BD%9C%E5%BC%8F%E7%9A%84%E4%BA%A4%E5%8F%89%E8%B0%83%E5%BA%A6%E6%89%A7%E8%A1%8C.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是吴咏炜。 今天是我们未来篇的最后一讲，也是这个专栏正文内容的最后一篇了。我们讨论 C++20 里的又一个非常重要的新功能——协程 Coroutines。 什么是协程？ 协程是一个很早就被提出的编程概念。根据高德纳的描述，协程的概念在 1958 年就被提出了。不过，它在主流编程语言中得到的支持不那么好，因而你很可能对它并不熟悉吧。 如果查阅维基..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":14.72,"words":4417},"filePathRelative":"posts/现代C++实战30讲/未来篇/30 _ Coroutines：协作式的交叉调度执行.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"30 | Coroutines：协作式的交叉调度执行\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/b2/ee/b233b80aa52a63b9b45756145ea910ee.mp3\\"></audio></p>\\n<p>你好，我是吴咏炜。</p>\\n<p>今天是我们未来篇的最后一讲，也是这个专栏正文内容的最后一篇了。我们讨论 C++20 里的又一个非常重要的新功能——协程 Coroutines。</p>","autoDesc":true}');export{t as comp,o as data};
