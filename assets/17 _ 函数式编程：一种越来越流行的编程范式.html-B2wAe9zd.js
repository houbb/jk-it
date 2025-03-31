import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(r,n){return i(),a("div",null,n[0]||(n[0]=[e(`<h1 id="_17-函数式编程-一种越来越流行的编程范式" tabindex="-1"><a class="header-anchor" href="#_17-函数式编程-一种越来越流行的编程范式"><span>17 _ 函数式编程：一种越来越流行的编程范式</span></a></h1><p><audio id="audio" title="17 | 函数式编程：一种越来越流行的编程范式" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/10/3f/10dfc792f12f2882ba1329089b06323f.mp3"></audio></p><p>你好，我是吴咏炜。</p><p>上一讲我们初步介绍了函数对象和 lambda 表达式，今天我们来讲讲它们的主要用途——函数式编程。</p><h2 id="一个小例子" tabindex="-1"><a class="header-anchor" href="#一个小例子"><span>一个小例子</span></a></h2><p>按惯例，我们还是从一个例子开始。想一下，如果给定一组文件名，要求数一下文件里的总文本行数，你会怎么做？</p><p>我们先规定一下函数的原型：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int count_lines(const char** begin,</span></span>
<span class="line"><span>                const char** end);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说，我们期待接受两个 C 字符串的迭代器，用来遍历所有的文件名；返回值代表文件中的总行数。</p><p>要测试行为是否正常，我们需要一个很小的 <code>main</code> 函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int main(int argc,</span></span>
<span class="line"><span>         const char** argv)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int total_lines = count_lines(</span></span>
<span class="line"><span>    argv + 1, argv + argc);</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;Total lines: &quot;</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; total_lines &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最传统的命令式编程大概会这样写代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int count_file(const char* name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int count = 0;</span></span>
<span class="line"><span>  ifstream ifs(name);</span></span>
<span class="line"><span>  string line;</span></span>
<span class="line"><span>  for (;;) {</span></span>
<span class="line"><span>    getline(ifs, line);</span></span>
<span class="line"><span>    if (!ifs) {</span></span>
<span class="line"><span>      break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ++count;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return count;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int count_lines(const char** begin,</span></span>
<span class="line"><span>                const char** end)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int count = 0;</span></span>
<span class="line"><span>  for (; begin != end; ++begin) {</span></span>
<span class="line"><span>    count += count_file(*begin);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return count;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们马上可以做一个简单的“说明式”改造。用 <code>istream_line_reader</code> 可以简化 <code>count_file</code> 成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int count_file(const char* name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  int count = 0;</span></span>
<span class="line"><span>  ifstream ifs(name);</span></span>
<span class="line"><span>  for (auto&amp;amp;&amp;amp; line :</span></span>
<span class="line"><span>       istream_line_reader(ifs)) {</span></span>
<span class="line"><span>    ++count;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return count;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这儿，要请你停一下，想一想如何进一步优化这个代码。然后再继续进行往下看。</p><p>如果我们使用之前已经出场过的两个函数，<code>transform</code> [1] 和 <code>accumulate</code> [2]，代码可以进一步简化为：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int count_file(const char* name)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  ifstream ifs(name);</span></span>
<span class="line"><span>  istream_line_reader reader(ifs);</span></span>
<span class="line"><span>  return distance(reader.begin(),</span></span>
<span class="line"><span>                  reader.end());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int count_lines(const char** begin,</span></span>
<span class="line"><span>                const char** end)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  vector&amp;lt;int&amp;gt; count(end - begin);</span></span>
<span class="line"><span>  transform(begin, end,</span></span>
<span class="line"><span>            count.begin(),</span></span>
<span class="line"><span>            count_file);</span></span>
<span class="line"><span>  return accumulate(</span></span>
<span class="line"><span>    count.begin(), count.end(),</span></span>
<span class="line"><span>    0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个就是一个非常函数式风格的结果了。上面这个处理方式恰恰就是 map-reduce。<code>transform</code> 对应 map，<code>accumulate</code> 对应 reduce。而检查有多少行文本，也成了代表文件头尾两个迭代器之间的“距离”（distance）。</p><h2 id="函数式编程的特点" tabindex="-1"><a class="header-anchor" href="#函数式编程的特点"><span>函数式编程的特点</span></a></h2><p>在我们的代码里不那么明显的一点是，函数式编程期望函数的行为像数学上的函数，而非一个计算机上的子程序。这样的函数一般被称为纯函数（pure function），要点在于：</p><ul><li>会影响函数结果的只是函数的参数，没有对环境的依赖</li><li>返回的结果就是函数执行的唯一后果，不产生对环境的其他影响</li></ul><p>这样的代码的最大好处是易于理解和易于推理，在很多情况下也会使代码更简单。在我们上面的代码里，<code>count_file</code> 和 <code>accumulate</code> 基本上可以看做是纯函数（虽然前者实际上有着对文件系统的依赖），但 <code>transform</code> 不行，因为它改变了某个参数，而不是返回一个结果。下一讲我们会看到，这会影响代码的组合性。</p><p>我们的代码中也体现了其他一些函数式编程的特点：</p><ul><li>函数就像普通的对象一样被传递、使用和返回。</li><li>代码为说明式而非命令式。在熟悉函数式编程的基本范式后，你会发现说明式代码的可读性通常比命令式要高，代码还短。</li><li>一般不鼓励（甚至完全不使用）可变量。上面代码里只有 <code>count</code> 的内容在执行过程中被修改了，而且这种修改实际是 <code>transform</code> 接口带来的。如果接口像<a href="https://time.geekbang.org/column/article/181608" target="_blank" rel="noopener noreferrer">[第 13 讲]</a> 展示的 <code>fmap</code> 函数一样返回一个容器的话，就可以连这个问题都消除了。（C++ 毕竟不是一门函数式编程语言，对灵活性的追求压倒了其他考虑。）</li></ul><h3 id="高阶函数" tabindex="-1"><a class="header-anchor" href="#高阶函数"><span>高阶函数</span></a></h3><p>既然函数（对象）可以被传递、使用和返回，自然就有函数会接受函数作为参数或者把函数作为返回值，这样的函数就被称为高阶函数。我们现在已经见过不少高阶函数了，如：</p><ul><li><code>sort</code></li><li><code>transform</code></li><li><code>accumulate</code></li><li><code>fmap</code></li><li><code>adder</code></li></ul><p>事实上，C++ 里以 algorithm（算法）[3] 名义提供的很多函数都是高阶函数。</p><p>许多高阶函数在函数式编程中已成为基本的惯用法，在不同语言中都会出现，虽然可能是以不同的名字。我们在此介绍非常常见的三个，map（映射）、reduce（归并）和 filter（过滤）。</p><p>Map 在 C++ 中的直接映射是 <code>transform</code>（在 &lt;algorithm&gt; 头文件中提供）。它所做的事情也是数学上的映射，把一个范围里的对象转换成相同数量的另外一些对象。这个函数的基本实现非常简单，但这是一种强大的抽象，在很多场合都用得上。</p><p>Reduce 在 C++ 中的直接映射是 <code>accumulate</code>（在 &lt;numeric&gt; 头文件中提供）。它的功能是在指定的范围里，使用给定的初值和函数对象，从左到右对数值进行归并。在不提供函数对象作为第四个参数时，功能上相当于默认提供了加法函数对象，这时相当于做累加；提供了其他函数对象时，那当然就是使用该函数对象进行归并了。</p><p>Filter 的功能是进行过滤，筛选出符合条件的成员。它在当前 C++（C++20 之前）里的映射可以认为有两个：<code>copy_if</code> 和 <code>partition</code>。这是因为在 C++20 带来 ranges 之前，在 C++ 里实现惰性求值不太方便。上面说的两个函数里，<code>copy_if</code> 是把满足条件的元素拷贝到另外一个迭代器里；<code>partition</code> 则是根据过滤条件来对范围里的元素进行分组，把满足条件的放在返回值迭代器的前面。另外，<code>remove_if</code> 也有点相近，通常用于删除满足条件的元素。它确保把不满足条件的元素放在返回值迭代器的前面（但不保证满足条件的元素在函数返回后一定存在），然后你一般需要使用容器的 <code>erase</code> 成员函数来将待删除的元素真正删除。</p><h3 id="命令式编程和说明式编程" tabindex="-1"><a class="header-anchor" href="#命令式编程和说明式编程"><span>命令式编程和说明式编程</span></a></h3><p>传统上 C++ 属于命令式编程。命令式编程里，代码会描述程序的具体执行步骤。好处是代码显得比较直截了当；缺点就是容易让人只见树木、不见森林，只能看到代码啰嗦地怎么做（how），而不是做什么（what），更不用说为什么（why）了。</p><p>说明式编程则相反。以数据库查询语言 SQL 为例，SQL 描述的是类似于下面的操作：你想从什么地方（from）选择（select）满足什么条件（where）的什么数据，并可选指定排序（order by）或分组（group by）条件。你不需要告诉数据库引擎具体该如何去执行这个操作。事实上，在选择查询策略上，大部分数据库用户都不及数据库引擎“聪明”；正如大部分开发者在写出优化汇编代码上也不及编译器聪明一样。</p><p>这并不是说说明式编程一定就优于命令式编程。事实上，对于很多算法，命令式才是最自然的实现。以快速排序为例，很多地方在讲到函数式编程时会给出下面这个 Haskell（一种纯函数式的编程语言）的例子来说明函数式编程的简洁性：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>quicksort []     = []</span></span>
<span class="line"><span>quicksort (p:xs) = (quicksort left)</span></span>
<span class="line"><span>         ++ [p] ++ (quicksort right)</span></span>
<span class="line"><span>  where</span></span>
<span class="line"><span>    left  = filter (&amp;lt; p) xs</span></span>
<span class="line"><span>    right = filter (&amp;gt;= p) xs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码简洁性确实没话说，但问题是，上面的代码的性能其实非常糟糕。真正接近 C++ 性能的快速排序，在 Haskell 里写出来一点不优雅，反而更丑陋 [4]。</p><p>所以，我个人认为，说明式编程跟命令式编程可以结合起来产生既优雅又高效的代码。对于从命令式编程成长起来的大部分程序员，我的建议是：</p><ul><li>写表意的代码，不要过于专注性能而让代码难以维护——记住高德纳的名言：“过早优化是万恶之源。”</li><li>使用有意义的变量，但尽量不要去修改变量内容——变量的修改非常容易导致程序员的思维错误。</li><li>类似地，尽量使用没有副作用的函数，并让你写的代码也尽量没有副作用，用返回值来代表状态的变化——没有副作用的代码更容易推理，更不容易出错。</li><li>代码的隐式依赖越少越好，尤其是不要使用全局变量——隐式依赖会让代码里的错误难以排查，也会让代码更难以测试。</li><li>使用知名的高级编程结构，如基于范围的 for 循环、映射、归并、过滤——这可以让你的代码更简洁，更易于推理，并减少类似下标越界这种低级错误的可能性。</li></ul><p>这些跟函数式编程有什么关系呢？——这些差不多都是来自函数式编程的最佳实践。学习函数式编程，也是为了更好地体会如何从这些地方入手，写出易读而又高性能的代码。</p><h3 id="不可变性和并发" tabindex="-1"><a class="header-anchor" href="#不可变性和并发"><span>不可变性和并发</span></a></h3><p>在多核的时代里，函数式编程比以前更受青睐，一个重要的原因是函数式编程对并行并发天然友好。影响多核性能的一个重要因素是数据的竞争条件——由于共享内存数据需要加锁带来的延迟。函数式编程强调不可变性（immutability）、无副作用，天然就适合并发。更妙的是，如果你使用高层抽象的话，有时可以轻轻松松“免费”得到性能提升。</p><p>拿我们这一讲开头的例子来说，对代码做下面的改造，启用 C++17 的并行执行策略 [5]，就能自动获得在多核环境下的性能提升：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int count_lines(const char** begin,</span></span>
<span class="line"><span>                const char** end)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  vector&amp;lt;int&amp;gt; count(end - begin);</span></span>
<span class="line"><span>  transform(execution::par,</span></span>
<span class="line"><span>            begin, end,</span></span>
<span class="line"><span>            count.begin(),</span></span>
<span class="line"><span>            count_file);</span></span>
<span class="line"><span>  return reduce(</span></span>
<span class="line"><span>    execution::par,</span></span>
<span class="line"><span>    count.begin(), count.end());</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以看到，两个高阶函数的调用中都加入了 <code>execution::par</code>，来启动自动并行计算。要注意的是，我把 <code>accumulate</code> 换成了 <code>reduce</code> [6]，原因是前者已经定义成从左到右的归并，无法并行。<code>reduce</code> 则不同，初始值可以省略，操作上没有规定顺序，并反过来要求对元素的归并操作满足交换律和结合率（加法当然是满足的），即：</p><p>$$<br><br> \\begin{aligned}<br><br> A\\ \\otimes\\ B &amp;= B\\ \\otimes\\ A\\&lt;br/&gt;<br> (A\\ \\otimes\\ B)\\ \\otimes\\ C &amp;= A\\ \\otimes\\ (B\\ \\otimes\\ C)<br><br> \\end{aligned}<br><br> $$</p><p>当然，在这个例子里，一般我们不会有海量文件，即使有海量文件，并行读取性能一般也不会快于顺序读取，所以意义并不是很大。下面这个简单的例子展示了并行 <code>reduce</code> 的威力：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;chrono&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;execution&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;numeric&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;vector&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  vector&amp;lt;double&amp;gt; v(10000000, 0.0625);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    auto t1 = chrono::</span></span>
<span class="line"><span>      high_resolution_clock::now();</span></span>
<span class="line"><span>    double result = accumulate(</span></span>
<span class="line"><span>      v.begin(), v.end(), 0.0);</span></span>
<span class="line"><span>    auto t2 = chrono::</span></span>
<span class="line"><span>      high_resolution_clock::now();</span></span>
<span class="line"><span>    chrono::duration&amp;lt;double, milli&amp;gt;</span></span>
<span class="line"><span>      ms = t2 - t1;</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; &quot;accumulate: result &quot;</span></span>
<span class="line"><span>         &amp;lt;&amp;lt; result &amp;lt;&amp;lt; &quot; took &quot;</span></span>
<span class="line"><span>         &amp;lt;&amp;lt; ms.count() &amp;lt;&amp;lt; &quot; ms\\n&quot;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    auto t1 = chrono::</span></span>
<span class="line"><span>      high_resolution_clock::now();</span></span>
<span class="line"><span>    double result =</span></span>
<span class="line"><span>      reduce(execution::par,</span></span>
<span class="line"><span>             v.begin(), v.end());</span></span>
<span class="line"><span>    auto t2 = chrono::</span></span>
<span class="line"><span>      high_resolution_clock::now();</span></span>
<span class="line"><span>    chrono::duration&amp;lt;double, milli&amp;gt;</span></span>
<span class="line"><span>      ms = t2 - t1;</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; &quot;reduce:     result &quot;</span></span>
<span class="line"><span>         &amp;lt;&amp;lt; result &amp;lt;&amp;lt; &quot; took &quot;</span></span>
<span class="line"><span>         &amp;lt;&amp;lt; ms.count() &amp;lt;&amp;lt; &quot; ms\\n&quot;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在我的电脑（Core i7 四核八线程）上的某次执行结果是：</p><blockquote></blockquote><p>\`accumulate: result 625000 took 26.122 ms\`<br> \`reduce: result 625000 took 4.485 ms\`</p><p>执行策略还比较新，还没有被所有编译器支持。我目前测试下来，MSVC 没有问题，Clang 不行，GCC 需要外部库 TBB（Threading Building Blocks）[7] 的帮助。我上面是用 GCC 编译的，命令行是：</p><blockquote></blockquote><p><code>g++-9 -std=c++17 -O3 test.cpp -ltbb</code></p><h2 id="y-组合子" tabindex="-1"><a class="header-anchor" href="#y-组合子"><span>Y 组合子</span></a></h2><p>限于篇幅，这一讲我们只是很初浅地探讨了函数式编程。对于 C++ 的函数式编程的深入探讨是有整本书的（见参考资料 [8]），而今天讲的内容在书的最前面几章就覆盖完了。在后面，我们还会探讨部分的函数式编程话题；今天我们只再讨论一个有点有趣、也有点烧脑的话题，Y 组合子 [9]。第一次阅读的时候，如果觉得困难，可以跳过这一部分。</p><p>不过，我并不打算讨论 Haskell Curry 使用的 Y 组合子定义——这个比较复杂，需要写一篇完整的文章来讨论（[10]），而且在 C++ 中的实用性非常弱。我们只看它解决的问题：如何在 lambda 表达式中表现递归。</p><p>回想一下我们用过的阶乘的递归定义：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int factorial(int n)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  if (n == 0) {</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    return n * factorial(n - 1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意里面用到了递归，所以你要把它写成 lambda 表达式是有点困难的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>auto factorial = [](int n) {</span></span>
<span class="line"><span>  if (n == 0) {</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    return n * ???(n - 1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面我们讨论使用 Y 组合子的解决方案。</p><p>我们首先需要一个特殊的高阶函数，定义为：</p><p>$$<br><br> y(f) = f(y(f))<br><br> $$</p><p>显然，这个定义有点奇怪。事实上，它是会导致无限展开的——而它的威力也在于无限展开。我们也因此必须使用惰性求值的方式才能使用这个定义。</p><p>然后，我们定义阶乘为：</p><p>$$<br><br> \\mathrm{fact}(n) = \\mathrm{If\\ IsZero}(n)\\ \\mathrm{then}\\ 1\\ \\mathrm{else}\\ n \\times \\mathrm{fact}(n − 1)<br><br> $$</p><p>假设 $\\mathrm{fact}$ 可以表示成 $y(F)$，那我们可以做下面的变形：</p><p>$$<br><br> \\begin{aligned}<br><br> y(F)(n) &amp;= \\mathrm{If\\ IsZero}(n)\\ \\mathrm{then}\\ 1\\ \\mathrm{else}\\ n \\times y(F)(n − 1)\\&lt;br/&gt;<br> F(y(F))(n) &amp;= \\mathrm{If\\ IsZero}(n)\\ \\mathrm{then}\\ 1\\ \\mathrm{else}\\ n \\times y(F)(n − 1)<br><br> \\end{aligned}<br><br> $$</p><p>再把 $y(F)$ 替换成 $f$，我们从上面的第二个式子得到：</p><p>$$<br><br> F(f)(n) = \\mathrm{If\\ IsZero}(n)\\ \\mathrm{then}\\ 1\\ \\mathrm{else}\\ n \\times f(n − 1)<br><br> $$</p><p>我们得到了 $F$ 的定义，也就自然得到了 $\\mathrm{fact}$ 的定义。而且，这个定义是可以用 C++ 表达出来的。下面是完整的代码实现：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;functional&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;type_traits&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;utility&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Y combinator as presented by Yegor Derevenets in P0200R0</span></span>
<span class="line"><span>// &amp;lt;url:http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2016/p0200r0.html&amp;gt;</span></span>
<span class="line"><span>template &amp;lt;class Fun&amp;gt;</span></span>
<span class="line"><span>class y_combinator_result {</span></span>
<span class="line"><span>  Fun fun_;</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  template &amp;lt;class T&amp;gt;</span></span>
<span class="line"><span>  explicit y_combinator_result(</span></span>
<span class="line"><span>    T&amp;amp;&amp;amp; fun)</span></span>
<span class="line"><span>    : fun_(std::forward&amp;lt;T&amp;gt;(fun))</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  template &amp;lt;class... Args&amp;gt;</span></span>
<span class="line"><span>  decltype(auto)</span></span>
<span class="line"><span>  operator()(Args&amp;amp;&amp;amp;... args)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    // y(f) = f(y(f))</span></span>
<span class="line"><span>    return fun_(</span></span>
<span class="line"><span>      std::ref(*this),</span></span>
<span class="line"><span>      std::forward&amp;lt;Args&amp;gt;(args)...);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;class Fun&amp;gt;</span></span>
<span class="line"><span>decltype(auto)</span></span>
<span class="line"><span>y_combinator(Fun&amp;amp;&amp;amp; fun)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  return y_combinator_result&amp;lt;</span></span>
<span class="line"><span>    std::decay_t&amp;lt;Fun&amp;gt;&amp;gt;(</span></span>
<span class="line"><span>    std::forward&amp;lt;Fun&amp;gt;(fun));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  // 上面的那个 F</span></span>
<span class="line"><span>  auto almost_fact =</span></span>
<span class="line"><span>    [](auto f, int n) -&amp;gt; int {</span></span>
<span class="line"><span>    if (n == 0)</span></span>
<span class="line"><span>      return 1;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>      return n * f(n - 1);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  // fact = y(F)</span></span>
<span class="line"><span>  auto fact =</span></span>
<span class="line"><span>    y_combinator(almost_fact);</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; fact(10) &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一节不影响后面的内容，看不懂的可以暂时略过。😝</p><h2 id="内容小结" tabindex="-1"><a class="header-anchor" href="#内容小结"><span>内容小结</span></a></h2><p>本讲我们对函数式编程进行了一个入门式的介绍，希望你对函数式编程的特点、优缺点有了一个初步的了解。然后，我快速讨论了一个会烧脑的话题，Y 组合子，让你对函数式编程的威力和难度也有所了解。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>想一想，你如何可以实现一个惰性的过滤器？一个惰性的过滤器应当让下面的代码通过编译，并且不会占用跟数据集大小相关的额外空间：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;numeric&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;vector&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// filter_view 的定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  vector v{1, 2, 3, 4, 5};</span></span>
<span class="line"><span>  auto&amp;amp;&amp;amp; fv = filter_view(</span></span>
<span class="line"><span>    v.begin(), v.end(), [](int x) {</span></span>
<span class="line"><span>      return x % 2 == 0;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; accumulate(fv.begin(),</span></span>
<span class="line"><span>                     fv.end(), 0)</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果输出应该是 <code>6</code>。</p><p>**提示：**参考 <code>istream_line_reader</code> 的实现。</p><p>告诉我你是否成功了，或者你遇到了什么样的特别困难。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>[1] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::transform”. <a href="https://en.cppreference.com/w/cpp/algorithm/transform" target="_blank" rel="noopener noreferrer">https://en.cppreference.com/w/cpp/algorithm/transform</a></p><p>[1a] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::transform”. <a href="https://zh.cppreference.com/w/cpp/algorithm/transform" target="_blank" rel="noopener noreferrer">https://zh.cppreference.com/w/cpp/algorithm/transform</a></p><p>[2] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::accumulate”. <a href="https://en.cppreference.com/w/cpp/algorithm/accumulate" target="_blank" rel="noopener noreferrer">https://en.cppreference.com/w/cpp/algorithm/accumulate</a></p><p>[2a] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::accumulate”. <a href="https://zh.cppreference.com/w/cpp/algorithm/accumulate" target="_blank" rel="noopener noreferrer">https://zh.cppreference.com/w/cpp/algorithm/accumulate</a></p><p>[3] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “Standard library header &lt;algorithm&gt;”. <a href="https://en.cppreference.com/w/cpp/header/algorithm" target="_blank" rel="noopener noreferrer">https://en.cppreference.com/w/cpp/header/algorithm</a></p><p>[3a] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “标准库头文件 &lt;algorithm&gt;”. <a href="https://zh.cppreference.com/w/cpp/header/algorithm" target="_blank" rel="noopener noreferrer">https://zh.cppreference.com/w/cpp/header/algorithm</a></p><p>[4] 袁英杰, “Immutability: The Dark Side”. <a href="https://www.jianshu.com/p/13cd4c650125" target="_blank" rel="noopener noreferrer">https://www.jianshu.com/p/13cd4c650125</a></p><p>[5] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “Standard library header &lt;execution&gt;”. <a href="https://en.cppreference.com/w/cpp/header/execution" target="_blank" rel="noopener noreferrer">https://en.cppreference.com/w/cpp/header/execution</a></p><p>[5a] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “标准库头文件 &lt;execution&gt;”. <a href="https://zh.cppreference.com/w/cpp/header/execution" target="_blank" rel="noopener noreferrer">https://zh.cppreference.com/w/cpp/header/execution</a></p><p>[6] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::reduce”. <a href="https://en.cppreference.com/w/cpp/algorithm/reduce" target="_blank" rel="noopener noreferrer">https://en.cppreference.com/w/cpp/algorithm/reduce</a></p><p>[6a] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::reduce”. <a href="https://zh.cppreference.com/w/cpp/algorithm/reduce" target="_blank" rel="noopener noreferrer">https://zh.cppreference.com/w/cpp/algorithm/reduce</a></p><p>[7] Intel, tbb. <a href="https://github.com/intel/tbb" target="_blank" rel="noopener noreferrer">https://github.com/intel/tbb</a></p><p>[8] Ivan Čukić, <strong>Functional Programming in C++</strong>. Manning, 2019, <a href="https://www.manning.com/books/functional-programming-in-c-plus-plus" target="_blank" rel="noopener noreferrer">https://www.manning.com/books/functional-programming-in-c-plus-plus</a></p><p>[9] Wikipedia, “Fixed-point combinator”. <a href="https://en.wikipedia.org/wiki/Fixed-point_combinator" target="_blank" rel="noopener noreferrer">https://en.wikipedia.org/wiki/Fixed-point_combinator</a></p><p>[10] 吴咏炜, “<strong>Y</strong> Combinator and C++”. <a href="https://yongweiwu.wordpress.com/2014/12/14/y-combinator-and-cplusplus/" target="_blank" rel="noopener noreferrer">https://yongweiwu.wordpress.com/2014/12/14/y-combinator-and-cplusplus/</a></p>`,100)]))}const d=s(p,[["render",l]]),o=JSON.parse('{"path":"/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E6%8F%90%E9%AB%98%E7%AF%87/17%20_%20%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B%EF%BC%9A%E4%B8%80%E7%A7%8D%E8%B6%8A%E6%9D%A5%E8%B6%8A%E6%B5%81%E8%A1%8C%E7%9A%84%E7%BC%96%E7%A8%8B%E8%8C%83%E5%BC%8F.html","title":"17 _ 函数式编程：一种越来越流行的编程范式","lang":"zh-CN","frontmatter":{"description":"17 _ 函数式编程：一种越来越流行的编程范式 你好，我是吴咏炜。 上一讲我们初步介绍了函数对象和 lambda 表达式，今天我们来讲讲它们的主要用途——函数式编程。 一个小例子 按惯例，我们还是从一个例子开始。想一下，如果给定一组文件名，要求数一下文件里的总文本行数，你会怎么做？ 我们先规定一下函数的原型： 也就是说，我们期待接受两个 C 字符串的迭...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E6%8F%90%E9%AB%98%E7%AF%87/17%20_%20%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B%EF%BC%9A%E4%B8%80%E7%A7%8D%E8%B6%8A%E6%9D%A5%E8%B6%8A%E6%B5%81%E8%A1%8C%E7%9A%84%E7%BC%96%E7%A8%8B%E8%8C%83%E5%BC%8F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"17 _ 函数式编程：一种越来越流行的编程范式"}],["meta",{"property":"og:description","content":"17 _ 函数式编程：一种越来越流行的编程范式 你好，我是吴咏炜。 上一讲我们初步介绍了函数对象和 lambda 表达式，今天我们来讲讲它们的主要用途——函数式编程。 一个小例子 按惯例，我们还是从一个例子开始。想一下，如果给定一组文件名，要求数一下文件里的总文本行数，你会怎么做？ 我们先规定一下函数的原型： 也就是说，我们期待接受两个 C 字符串的迭..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"17 _ 函数式编程：一种越来越流行的编程范式\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":14.15,"words":4244},"filePathRelative":"posts/现代C++实战30讲/提高篇/17 _ 函数式编程：一种越来越流行的编程范式.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"17 | 函数式编程：一种越来越流行的编程范式\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/10/3f/10dfc792f12f2882ba1329089b06323f.mp3\\"></audio></p>\\n<p>你好，我是吴咏炜。</p>\\n<p>上一讲我们初步介绍了函数对象和 lambda 表达式，今天我们来讲讲它们的主要用途——函数式编程。</p>\\n<h2>一个小例子</h2>\\n<p>按惯例，我们还是从一个例子开始。想一下，如果给定一组文件名，要求数一下文件里的总文本行数，你会怎么做？</p>","autoDesc":true}');export{d as comp,o as data};
