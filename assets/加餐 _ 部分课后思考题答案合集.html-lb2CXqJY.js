import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(r,n){return i(),a("div",null,n[0]||(n[0]=[e(`<h1 id="加餐-部分课后思考题答案合集" tabindex="-1"><a class="header-anchor" href="#加餐-部分课后思考题答案合集"><span>加餐 _ 部分课后思考题答案合集</span></a></h1><p><audio id="audio" title="加餐 | 部分课后思考题答案合集" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/b8/ea/b8a140e0b755ff313de8d8b73eecf8ea.mp3"></audio></p><p>你好，我是吴咏炜。这一讲我为你整理了本专栏部分课后思考题的答案，给你作为参考。</p><h2 id="第-2-讲" tabindex="-1"><a class="header-anchor" href="#第-2-讲"><span><a href="https://time.geekbang.org/column/article/169263" target="_blank" rel="noopener noreferrer">第 2 讲</a></span></a></h2><p><strong>你觉得智能指针应该满足什么样的线程安全性？</strong></p><p>答：（不是真正的回答，只是描述一下标准中的智能指针的线程安全性。）</p><ol><li>多个不同线程同时访问不同的智能指针（不管是否指向同一个对象）是安全的。</li><li>多个不同线程同时读取同一个智能指针是安全的。</li><li>多个不同线程在同一个智能指针上执行原子操作（<code>atomic_load</code> 等）是安全的。</li><li>多个不同线程根据同一个智能指针创建新的智能指针（增加引用计数）是安全的。</li><li>只会有一个线程最后会（在引用计数表示已经无引用时）调用删除函数去销毁存储的对象。</li></ol><p>其他操作潜在是不安全的，特别是在不同的线程对同一个智能指针执行 <code>reset</code> 等修改操作。</p><h2 id="第-3-讲" tabindex="-1"><a class="header-anchor" href="#第-3-讲"><span><a href="https://time.geekbang.org/column/article/169268" target="_blank" rel="noopener noreferrer">第 3 讲</a></span></a></h2><p><strong>为什么 <code>smart_ptr::operator=</code> 对左值和右值都有效，而且不需要对等号两边是否引用同一对象进行判断？</strong></p><p>答：我们使用值类型而非引用类型作为形参，这样实参永远会被移动（右值的情况）或复制（左值的情况），不可能和 <code>*this</code> 引用同一个对象。</p><h2 id="第-4-讲" tabindex="-1"><a class="header-anchor" href="#第-4-讲"><span><a href="https://time.geekbang.org/column/article/173167" target="_blank" rel="noopener noreferrer">第 4 讲</a></span></a></h2><p><strong>为什么 <code>stack</code>（或 <code>queue</code>）的 <code>pop</code> 函数返回类型为 <code>void</code>，而不是直接返回容器的 <code>top</code>（或 <code>front</code>）成员？</strong></p><p>答：这是 C++98 里、还没有移动语义时的设计。如果 <code>pop</code> 返回元素，而元素拷贝时发生异常的话，那这个元素就丢失了。因而容器设计成有分离的 <code>top</code>（或 <code>front</code>）和 <code>pop</code> 成员函数，分别执行访问和弹出的操作。</p><p>有一种可能的设计是把接口改成 <code>void pop(T&amp;amp;)</code>，这增加了 <code>T</code> 必须支持默认构造和赋值的要求，在单线程为主的年代没有明显的好处，反而带来了对 <code>T</code> 的额外要求。</p><h2 id="第-5-讲" tabindex="-1"><a class="header-anchor" href="#第-5-讲"><span><a href="https://time.geekbang.org/column/article/174434" target="_blank" rel="noopener noreferrer">第 5 讲</a></span></a></h2><p><strong>为什么大部分容器都提供了 <code>begin</code>、<code>end</code> 等方法？</strong></p><p>答：容器提供了 <code>begin</code> 和 <code>end</code> 方法，就意味着是可以迭代（遍历）的。大部分容器都可以从头到尾遍历，因而也就需要提供这两个方法。</p><p><strong>为什么容器没有继承一个公用的基类？</strong></p><p>答：C++ 不是面向对象的语言，尤其在标准容器的设计上主要使用值语义，使用公共基类完全没有用处。</p><h2 id="第-7-讲" tabindex="-1"><a class="header-anchor" href="#第-7-讲"><span><a href="https://time.geekbang.org/column/article/176842" target="_blank" rel="noopener noreferrer">第 7 讲</a></span></a></h2><p><strong>目前这个输入行迭代器的行为，在什么情况下可能导致意料之外的后果？</strong></p><p>答：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;fstream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &quot;istream_line_reader.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  ifstream ifs{&quot;test.cpp&quot;};</span></span>
<span class="line"><span>  istream_line_reader reader{ifs};</span></span>
<span class="line"><span>  auto begin = reader.begin();</span></span>
<span class="line"><span>  for (auto it = reader.begin();</span></span>
<span class="line"><span>    it != reader.end(); ++it) {</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; *it &amp;lt;&amp;lt; &#39;\\n&#39;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上代码，因为 begin 多调用了一次，输出就少了一行……</p><p><strong>请尝试一下改进这个输入行迭代器，看看能不能消除这种意外。如果可以，该怎么做？如果不可以，为什么？</strong></p><p>答：很困难。比如，文件如果为空的话，从迭代器的行为角度，<code>begin()</code> 应该等于 <code>end()</code>——不预先读取一次的话，就无法获知这个结果。这样的改造总体看起来很不值，因此一般都不会选择这样做。</p><h2 id="第-10-讲" tabindex="-1"><a class="header-anchor" href="#第-10-讲"><span><a href="https://time.geekbang.org/column/article/178940" target="_blank" rel="noopener noreferrer">第 10 讲</a></span></a></h2><p><strong>这讲里我们没有深入讨论赋值；请你思考一下，如果例子里改成赋值，会有什么样的变化？</strong></p><p>答：返回对象部分的讨论没有变化。对象的移动赋值操作应当实现成无异常，以确保数据不会丢失。</p><p>返回值优化在赋值情况下会失效。更一般的情况下，除非需要持续更新某个变量，比如在 <code>vector</code> 尾部追加数据，尽量对变量进行一次性赋值、不后续修改。这样的代码更容易推理，更不容易在后续修改中出错，也更能让编译器做（返回值）优化。</p><h2 id="第-11-讲" tabindex="-1"><a class="header-anchor" href="#第-11-讲"><span><a href="https://time.geekbang.org/column/article/179357" target="_blank" rel="noopener noreferrer">第 11 讲</a></span></a></h2><p><strong>为什么说 UTF-32 处理会比较简单？</strong></p><p>答：UTF-32 下，一个字符就是一个基本的处理单位，一般不会出现一个字符跨多个处理单位的情况（UTF-8 和 UTF-16 下会发生）。</p><p><strong>你知道什么情况下 UTF-32 也并不那么简单吗？</strong></p><p>答：Unicode 下有所谓的修饰字符，用来修饰前一个字符。按 Unicode 的处理规则，这些字符应该和基本字符一起处理（如断行之类）。所以 UTF-32 下也不可以在任意单位处粗暴断开处理。</p><p><strong>哪种 UTF 编码方式空间存储效率比较高？</strong></p><p>答：视存储的内容而定。</p><p>比如，如果内容以 ASCII 为主（如源代码），那 UTF-8 效率最高。如果内容以一般的中文文本为主，那 UTF-16 效率最高。</p><h2 id="第-12-讲" tabindex="-1"><a class="header-anchor" href="#第-12-讲"><span><a href="https://time.geekbang.org/column/article/179363" target="_blank" rel="noopener noreferrer">第 12 讲</a></span></a></h2><p><strong>为什么并非所有的语言都支持这些不同的多态方式？</strong></p><p>答：排除设计缺陷的情况，语言支持哪些多态方式，基本上取决于语言本身在类型方面的特性。</p><p>以 Python 为例，它是动态类型的语言。所以它不会有真正的静态多态。但和静态类型的面向对象语言（如 Java）不同，它的运行期多态不需要继承。没有参数化多态初看是个缺陷，但由于 Python 的动态参数系统允许默认参数和可变参数，并没有什么参数化多态能做得到而 Python 做不到的事。</p><h2 id="第-17-讲" tabindex="-1"><a class="header-anchor" href="#第-17-讲"><span><a href="https://time.geekbang.org/column/article/185189" target="_blank" rel="noopener noreferrer">第 17 讲</a></span></a></h2><p><strong>想一想，你如何可以实现一个惰性的过滤器？</strong></p><p>答：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iterator&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename I, typename F&amp;gt;</span></span>
<span class="line"><span>class filter_view {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  class iterator {</span></span>
<span class="line"><span>  public:</span></span>
<span class="line"><span>    typedef ptrdiff_t</span></span>
<span class="line"><span>      difference_type;</span></span>
<span class="line"><span>    typedef</span></span>
<span class="line"><span>      typename iterator_traits&amp;lt;</span></span>
<span class="line"><span>        I&amp;gt;::value_type value_type;</span></span>
<span class="line"><span>    typedef</span></span>
<span class="line"><span>      typename iterator_traits&amp;lt;</span></span>
<span class="line"><span>        I&amp;gt;::pointer pointer;</span></span>
<span class="line"><span>    typedef</span></span>
<span class="line"><span>      typename iterator_traits&amp;lt;</span></span>
<span class="line"><span>        I&amp;gt;::reference reference;</span></span>
<span class="line"><span>    typedef forward_iterator_tag</span></span>
<span class="line"><span>      iterator_category;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    iterator(I current, I end, F cond)</span></span>
<span class="line"><span>      : current_(current)</span></span>
<span class="line"><span>      , end_(end)</span></span>
<span class="line"><span>      , cond_(cond)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      if (current_ != end_ &amp;amp;&amp;amp;</span></span>
<span class="line"><span>          !cond_(*current_)) {</span></span>
<span class="line"><span>        ++*this;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    iterator&amp;amp; operator++()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      while (current_ != end_) {</span></span>
<span class="line"><span>        ++current_;</span></span>
<span class="line"><span>        if (cond_(*current_)) {</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return *this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    iterator operator++(int)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      auto temp = *this;</span></span>
<span class="line"><span>      ++*this;</span></span>
<span class="line"><span>      return temp;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    reference operator*() const</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      return *current_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    pointer operator-&amp;gt;() const</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      return &amp;amp;*current_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bool operator==(const iterator&amp;amp; rhs)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      return current_ == rhs.current_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    bool operator!=(const iterator&amp;amp; rhs)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      return !operator==(rhs);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private:</span></span>
<span class="line"><span>    I current_;</span></span>
<span class="line"><span>    I end_;</span></span>
<span class="line"><span>    F cond_;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  filter_view(I begin, I end,</span></span>
<span class="line"><span>              F cond)</span></span>
<span class="line"><span>    : begin_(begin)</span></span>
<span class="line"><span>    , end_(end)</span></span>
<span class="line"><span>    , cond_(cond)</span></span>
<span class="line"><span>  {}</span></span>
<span class="line"><span>  iterator begin() const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return iterator(begin_, end_, cond_);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  iterator end() const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return iterator(end_, end_, cond_);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  I begin_;</span></span>
<span class="line"><span>  I end_;</span></span>
<span class="line"><span>  F cond_;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="第-18-讲" tabindex="-1"><a class="header-anchor" href="#第-18-讲"><span><a href="https://time.geekbang.org/column/article/185899" target="_blank" rel="noopener noreferrer">第 18 讲</a></span></a></h2><p><strong>我展示了 <code>compose</code> 带一个或更多参数的情况。你觉得 <code>compose</code> 不带任何参数该如何定义？它有意义吗？</strong></p><p>答：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>inline auto compose()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return [](auto&amp;amp;&amp;amp; x) -&amp;gt; decltype(auto)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        return std::forward&amp;lt;decltype(x)&amp;gt;(x);</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个函数把参数原封不动地传回。它的意义相当于加法里的 0，乘法里的 1。</p><p>在普通的加法里，你可能不太需要 0；但在一个做加法的地方，如果别人想告诉你不要做任何操作，传给你一个 0 是最简单的做法。</p><p><strong>有没有可能不用 <code>index_sequence</code> 来初始化 <code>bit_count</code>？如果行，应该如何实现？</strong></p><p>答：似乎没有通用的办法，因为目前 constexpr 要求在构造时直接初始化对象的内容。</p><p>但是，到了 C++20，允许 constexpr 对象里存在平凡默认构造的成员之后，就可以使用下面的写法了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;size_t N&amp;gt;</span></span>
<span class="line"><span>struct bit_count_t {</span></span>
<span class="line"><span>  constexpr bit_count_t()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    for (auto i = 0U; i &amp;lt; N; ++i) {</span></span>
<span class="line"><span>      count[i] = count_bits(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  unsigned char count[N];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>constexpr bit_count_t&amp;lt;256&amp;gt;</span></span>
<span class="line"><span>  bit_count;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当前已经发布的编译器中，我测下来只有 Clang 能（在 C++17 模式下）编译通过此代码。GCC 10 能在使用命令行选项 <code>-std=c++2a</code> 时编译通过此代码。</p><p><strong>作为一个挑战，你能自行实现出 <code>make_integer_sequence</code> 吗？</strong></p><p>答 1：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;class T, T... Ints&amp;gt;</span></span>
<span class="line"><span>struct integer_sequence {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;class T&amp;gt;</span></span>
<span class="line"><span>struct integer_sequence_ns {</span></span>
<span class="line"><span>  template &amp;lt;T N, T... Ints&amp;gt;</span></span>
<span class="line"><span>  struct integer_sequence_helper {</span></span>
<span class="line"><span>    using type =</span></span>
<span class="line"><span>      typename integer_sequence_helper&amp;lt;</span></span>
<span class="line"><span>        N - 1, N - 1,</span></span>
<span class="line"><span>        Ints...&amp;gt;::type;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  template &amp;lt;T... Ints&amp;gt;</span></span>
<span class="line"><span>  struct integer_sequence_helper&amp;lt;</span></span>
<span class="line"><span>    0, Ints...&amp;gt; {</span></span>
<span class="line"><span>    using type =</span></span>
<span class="line"><span>      integer_sequence&amp;lt;T, Ints...&amp;gt;;</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;class T, T N&amp;gt;</span></span>
<span class="line"><span>using make_integer_sequence =</span></span>
<span class="line"><span>  typename integer_sequence_ns&amp;lt;T&amp;gt;::</span></span>
<span class="line"><span>    template integer_sequence_helper&amp;lt;</span></span>
<span class="line"><span>      N&amp;gt;::type;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果一开始写成 <code>template &amp;lt;class T, T N, T... Ints&amp;gt; struct integer_sequence_helper</code> 的话，就会遇到错误“non-type template argument specializes a template parameter with dependent type ‘T’”（非类型的模板实参特化了一个使用依赖类型的‘T’的模板形参）。这是目前的 C++ 标准所不允许的写法，改写成嵌套类形式可以绕过这个问题。</p><p>答 2：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;class T, T... Ints&amp;gt;</span></span>
<span class="line"><span>struct integer_sequence {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;class T, T N, T... Is&amp;gt;</span></span>
<span class="line"><span>auto make_integer_sequence_impl()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  if constexpr (N == 0) {</span></span>
<span class="line"><span>    return integer_sequence&amp;lt;</span></span>
<span class="line"><span>      T, Is...&amp;gt;();</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    return make_integer_sequence_impl&amp;lt;</span></span>
<span class="line"><span>      T, N - 1, N - 1, Is...&amp;gt;();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;class T, T N&amp;gt;</span></span>
<span class="line"><span>using make_integer_sequence =</span></span>
<span class="line"><span>  decltype(</span></span>
<span class="line"><span>    make_integer_sequence_impl&amp;lt;</span></span>
<span class="line"><span>      T, N&amp;gt;());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这又是一个 <code>constexpr</code> 能简化表达的例子。</p><h2 id="第-19-讲" tabindex="-1"><a class="header-anchor" href="#第-19-讲"><span><a href="https://time.geekbang.org/column/article/186689" target="_blank" rel="noopener noreferrer">第 19 讲</a></span></a></h2><p><strong>并发编程中哪些情况下会发生死锁？</strong></p><p>答：多个线程里，如果没有或不能事先约定访问顺序，同时进行可阻塞的资源访问，访问顺序可以形成一个环，就会引发死锁。</p><p>可阻塞的资源访问可能包括（但不限于）：</p><ul><li>互斥量上的 <code>lock</code> 调用</li><li>条件变量上的 <code>wait</code> 调用</li><li>对线程的 <code>join</code> 调用</li><li>对 <code>future</code> 的 <code>get</code> 调用</li></ul><h2 id="第-27-讲" tabindex="-1"><a class="header-anchor" href="#第-27-讲"><span><a href="https://time.geekbang.org/column/article/193523" target="_blank" rel="noopener noreferrer">第 27 讲</a></span></a></h2><p><strong>你觉得 C++ REST SDK 的接口好用吗？如果好用，原因是什么？如果不好用，你有什么样的改进意见？</strong></p><p>答：举几个可能的改进点。</p><p>C++ REST SDK 的 <code>uri::decode</code> 接口设计有不少问题：</p><ul><li>最严重的，不能对 query string 的等号左边的部分进行 <code>decode</code>；只能先 <code>split_query</code> 再 <code>decode</code>，此时等号左边已经在 <code>map</code> 里，不能修改——要修改需要建一个新的 <code>map</code>。</li><li>目前的实现对“+”不能重新还原成空格。</li></ul><p>换个说法，目前的接口能正确处理“/search?q=query%20string”这样的请求，但不能正确处理“/search?%71=query+string”这样的请求。</p><p>应当有一个 <code>split_query_and_decode</code> 接口，同时执行分割和解码。</p><p>另外，<code>json</code> 的接口也还是不够好用，最主要是没有使用初始化列表的构造。构造复杂的 JSON 结构有点啰嗦了。</p><p><code>fstream::open_ostream</code> 缺省行为跟 <code>std::ofstream</code> 不一样应该是个 bug。应当要么修正接口（接口缺省参数里带上 <code>trunc</code>），要么修正实现（跟 <code>std::ofstream</code> 一样把 <code>out</code> 当成 <code>out|trunc</code>）。</p><h2 id="第-28-讲" tabindex="-1"><a class="header-anchor" href="#第-28-讲"><span><a href="https://time.geekbang.org/column/article/194005" target="_blank" rel="noopener noreferrer">第 28 讲</a></span></a></h2><p><strong>“概念”可以为开发具体带来哪些好处？反过来，负面的影响又可能会是什么？</strong></p><p>答：对于代码严谨、具有形式化思维的人，“概念”是个福音，它不仅可以大量消除 SFINAE 的使用，还能以较为精确和形式化的形式在代码里写出对类型的要求，使得代码变得清晰、易读。</p><p>但反过来说，“概念”比鸭子类型更严格。在代码加上概念约束后，相关代码很可能需要修改才能满足概念的要求，即使之前在实际使用中可能已经完全没有问题。从迭代器的角度，实际使用中最小功能集是构造、可复制、<code>*</code>、前置 <code>++</code>、与 sentinel 类型对象的 <code>!=</code>（单一形式）。而为了满足迭代器概念，则要额外确保满足以下各点：</p><ul><li>可默认初始化</li><li>在 iterator 类型和 sentinel 类型之间，需要定义完整的四个 <code>==</code> 和 <code>!=</code> 运算符</li><li>定义迭代器的标准内部类型，如 <code>difference_type</code> 等</li></ul><p>以上就是今天的全部内容了，希望能对你有所帮助！如果你有更多问题，还是请你在留言区中提出，我会一一解答。</p>`,85)]))}const t=s(p,[["render",l]]),o=JSON.parse('{"path":"/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%8A%A0%E9%A4%90/%E5%8A%A0%E9%A4%90%20_%20%E9%83%A8%E5%88%86%E8%AF%BE%E5%90%8E%E6%80%9D%E8%80%83%E9%A2%98%E7%AD%94%E6%A1%88%E5%90%88%E9%9B%86.html","title":"加餐 _ 部分课后思考题答案合集","lang":"zh-CN","frontmatter":{"description":"加餐 _ 部分课后思考题答案合集 你好，我是吴咏炜。这一讲我为你整理了本专栏部分课后思考题的答案，给你作为参考。 第 2 讲 你觉得智能指针应该满足什么样的线程安全性？ 答：（不是真正的回答，只是描述一下标准中的智能指针的线程安全性。） 多个不同线程同时访问不同的智能指针（不管是否指向同一个对象）是安全的。 多个不同线程同时读取同一个智能指针是安全的。...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%8A%A0%E9%A4%90/%E5%8A%A0%E9%A4%90%20_%20%E9%83%A8%E5%88%86%E8%AF%BE%E5%90%8E%E6%80%9D%E8%80%83%E9%A2%98%E7%AD%94%E6%A1%88%E5%90%88%E9%9B%86.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"加餐 _ 部分课后思考题答案合集"}],["meta",{"property":"og:description","content":"加餐 _ 部分课后思考题答案合集 你好，我是吴咏炜。这一讲我为你整理了本专栏部分课后思考题的答案，给你作为参考。 第 2 讲 你觉得智能指针应该满足什么样的线程安全性？ 答：（不是真正的回答，只是描述一下标准中的智能指针的线程安全性。） 多个不同线程同时访问不同的智能指针（不管是否指向同一个对象）是安全的。 多个不同线程同时读取同一个智能指针是安全的。..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"加餐 _ 部分课后思考题答案合集\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":9.95,"words":2986},"filePathRelative":"posts/现代C++实战30讲/加餐/加餐 _ 部分课后思考题答案合集.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"加餐 | 部分课后思考题答案合集\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/b8/ea/b8a140e0b755ff313de8d8b73eecf8ea.mp3\\"></audio></p>\\n<p>你好，我是吴咏炜。这一讲我为你整理了本专栏部分课后思考题的答案，给你作为参考。</p>\\n<h2><a class=\\"header-anchor\\" href=\\"#第-2-讲\\"><span></span></a><a href=\\"https://time.geekbang.org/column/article/169263\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">第 2 讲</a></h2>","autoDesc":true}');export{t as comp,o as data};
