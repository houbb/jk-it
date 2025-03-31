import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as p,o as e}from"./app-CrA-f6So.js";const i={};function l(r,s){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="_02-自己动手-实现c-的智能指针" tabindex="-1"><a class="header-anchor" href="#_02-自己动手-实现c-的智能指针"><span>02 _ 自己动手，实现C++的智能指针</span></a></h1><p><audio id="audio" title="02 | 自己动手，实现C++的智能指针" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/b0/9a/b0ad5b326e15129171b567a6f5763d9a.mp3"></audio></p><p>你好，我是吴咏炜。</p><p>上一讲，我们描述了一个某种程度上可以当成智能指针用的类 <code>shape_wrapper</code>。使用那个智能指针，可以简化资源的管理，从根本上消除资源（包括内存）泄漏的可能性。这一讲我们就来进一步讲解，如何将 <code>shape_wrapper</code> 改造成一个完整的智能指针。你会看到，智能指针本质上并不神秘，其实就是 RAII 资源管理功能的自然展现而已。</p><p>在学完这一讲之后，你应该会对 C++ 的 <code>unique_ptr</code> 和 <code>shared_ptr</code> 的功能非常熟悉了。同时，如果你今后要创建类似的资源管理类，也不会是一件难事。</p><h2 id="回顾" tabindex="-1"><a class="header-anchor" href="#回顾"><span>回顾</span></a></h2><p>我们上一讲给出了下面这个类：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class shape_wrapper {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  explicit shape_wrapper(</span></span>
<span class="line"><span>    shape* ptr = nullptr)</span></span>
<span class="line"><span>    : ptr_(ptr) {}</span></span>
<span class="line"><span>  ~shape_wrapper()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    delete ptr_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  shape* get() const { return ptr_; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  shape* ptr_;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个类可以完成智能指针的最基本的功能：对超出作用域的对象进行释放。<strong>但它缺了点东西：</strong></p><ol><li>这个类只适用于 <code>shape</code> 类</li><li>该类对象的行为不够像指针</li><li>拷贝该类对象会引发程序行为异常</li></ol><p>下面我们来逐一看一下怎么弥补这些问题。</p><h2 id="模板化和易用性" tabindex="-1"><a class="header-anchor" href="#模板化和易用性"><span>模板化和易用性</span></a></h2><p>要让这个类能够包装任意类型的指针，我们需要把它变成一个类模板。这实际上相当容易：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  explicit smart_ptr(T* ptr = nullptr)</span></span>
<span class="line"><span>    : ptr_(ptr) {}</span></span>
<span class="line"><span>  ~smart_ptr()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    delete ptr_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  T* get() const { return ptr_; }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  T* ptr_;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和 <code>shape_wrapper</code> 比较一下，我们就是在开头增加模板声明 <code>template &amp;lt;typename T&amp;gt;</code>，然后把代码中的 <code>shape</code> 替换成模板参数 <code>T</code> 而已。这些修改非常简单自然吧？模板本质上并不是一个很复杂的概念。这个模板使用也很简单，把原来的 <code>shape_wrapper</code> 改成 <code>smart_ptr&amp;lt;shape&amp;gt;</code> 就行。</p><p>目前这个 <code>smart_ptr</code> 的行为还是和指针有点差异的：</p><ul><li>它不能用 <code>*</code> 运算符解引用</li><li>它不能用 <code>-&amp;gt;</code> 运算符指向对象成员</li><li>它不能像指针一样用在布尔表达式里</li></ul><p>不过，这些问题也相当容易解决，加几个成员函数就可以：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>  T&amp;amp; operator*() const { return *ptr_; }</span></span>
<span class="line"><span>  T* operator-&amp;gt;() const { return ptr_; }</span></span>
<span class="line"><span>  operator bool() const { return ptr_; }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="拷贝构造和赋值" tabindex="-1"><a class="header-anchor" href="#拷贝构造和赋值"><span>拷贝构造和赋值</span></a></h2><p>拷贝构造和赋值，我们暂且简称为拷贝，这是个比较复杂的问题了。关键还不是实现问题，而是我们该如何定义其行为。假设有下面的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>smart_ptr&amp;lt;shape&amp;gt; ptr1{create_shape(shape_type::circle)};</span></span>
<span class="line"><span>smart_ptr&amp;lt;shape&amp;gt; ptr2{ptr1};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>对于第二行，究竟应当让编译时发生错误，还是可以有一个更合理的行为？我们来逐一检查一下各种可能性。</p><p>最简单的情况显然是禁止拷贝。我们可以使用下面的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>  smart_ptr(const smart_ptr&amp;amp;)</span></span>
<span class="line"><span>    = delete;</span></span>
<span class="line"><span>  smart_ptr&amp;amp; operator=(const smart_ptr&amp;amp;)</span></span>
<span class="line"><span>    = delete;</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>禁用这两个函数非常简单，但却解决了一种可能出错的情况。否则，<code>smart_ptr&amp;lt;shape&amp;gt; ptr2{ptr1};</code> 在编译时不会出错，但在运行时却会有未定义行为——由于会对同一内存释放两次，通常情况下会导致程序崩溃。</p><p>我们是不是可以考虑在拷贝智能指针时把对象拷贝一份？不行，通常人们不会这么用，因为使用智能指针的目的就是要减少对象的拷贝啊。何况，虽然我们的指针类型是 <code>shape</code>，但实际指向的却应该是 <code>circle</code> 或 <code>triangle</code> 之类的对象。在 C++ 里没有像 Java 的 <code>clone</code> 方法这样的约定；一般而言，并没有通用的方法可以通过基类的指针来构造出一个子类的对象来。</p><p>我们要么试试在拷贝时转移指针的所有权？大致实现如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>  smart_ptr(smart_ptr&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.release();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  smart_ptr&amp;amp; operator=(smart_ptr&amp;amp; rhs)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    smart_ptr(rhs).swap(*this);</span></span>
<span class="line"><span>    return *this;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>  T* release()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    T* ptr = ptr_;</span></span>
<span class="line"><span>    ptr_ = nullptr;</span></span>
<span class="line"><span>    return ptr;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  void swap(smart_ptr&amp;amp; rhs)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    using std::swap;</span></span>
<span class="line"><span>    swap(ptr_, rhs.ptr_);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在拷贝构造函数中，通过调用 <code>other</code> 的 <code>release</code> 方法来释放它对指针的所有权。在赋值函数中，则通过拷贝构造产生一个临时对象并调用 <code>swap</code> 来交换对指针的所有权。实现上是不复杂的。</p><p>如果你学到的赋值函数还有一个类似于 <code>if (this != &amp;amp;rhs)</code> 的判断的话，那种用法更啰嗦，而且异常安全性不够好——如果在赋值过程中发生异常的话，this 对象的内容可能已经被部分破坏了，对象不再处于一个完整的状态。</p><p>**上面代码里的这种惯用法（见参考资料 [1]）则保证了强异常安全性：**赋值分为拷贝构造和交换两步，异常只可能在第一步发生；而第一步如果发生异常的话，this 对象完全不受任何影响。无论拷贝构造成功与否，结果只有赋值成功和赋值没有效果两种状态，而不会发生因为赋值破坏了当前对象这种场景。</p><p>如果你觉得这个实现还不错的话，那恭喜你，你达到了 C++ 委员会在 1998 年时的水平：上面给出的语义本质上就是 C++98 的 <code>auto_ptr</code> 的定义。如果你觉得这个实现很别扭的话，也恭喜你，因为 C++ 委员会也是这么觉得的：<code>auto_ptr</code> 在 C++17 时已经被正式从 C++ 标准里删除了。</p><p>上面实现的最大问题是，它的行为会让程序员非常容易犯错。一不小心把它传递给另外一个 <code>smart_ptr</code>，你就不再拥有这个对象了……</p><h2 id="移动-指针" tabindex="-1"><a class="header-anchor" href="#移动-指针"><span>“移动”指针？</span></a></h2><p>在下一讲我们将完整介绍一下移动语义。这一讲，我们先简单看一下 <code>smart_ptr</code> 可以如何使用“移动”来改善其行为。</p><p>我们需要对代码做两处小修改：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>  smart_ptr(smart_ptr&amp;amp;&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.release();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  smart_ptr&amp;amp; operator=(smart_ptr rhs)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    rhs.swap(*this);</span></span>
<span class="line"><span>    return *this;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到修改的地方了吗？我改了两个地方：</p><ul><li>把拷贝构造函数中的参数类型 <code>smart_ptr&amp;amp;</code> 改成了 <code>smart_ptr&amp;amp;&amp;amp;</code>；现在它成了移动构造函数。</li><li>把赋值函数中的参数类型 <code>smart_ptr&amp;amp;</code> 改成了 <code>smart_ptr</code>，在构造参数时直接生成新的智能指针，从而不再需要在函数体中构造临时对象。现在赋值函数的行为是移动还是拷贝，完全依赖于构造参数时走的是移动构造还是拷贝构造。</li></ul><p>根据 C++ 的规则，如果我提供了移动构造函数而没有手动提供拷贝构造函数，那后者自动被禁用（记住，C++ 里那些复杂的规则也是为方便编程而设立的）。于是，我们自然地得到了以下结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>smart_ptr&amp;lt;shape&amp;gt; ptr1{create_shape(shape_type::circle)};</span></span>
<span class="line"><span>smart_ptr&amp;lt;shape&amp;gt; ptr2{ptr1};             // 编译出错</span></span>
<span class="line"><span>smart_ptr&amp;lt;shape&amp;gt; ptr3;</span></span>
<span class="line"><span>ptr3 = ptr1;                             // 编译出错</span></span>
<span class="line"><span>ptr3 = std::move(ptr1);                  // OK，可以</span></span>
<span class="line"><span>smart_ptr&amp;lt;shape&amp;gt; ptr4{std::move(ptr3)};  // OK，可以</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个就自然多了。</p><p>这也是 C++11 的 <code>unique_ptr</code> 的基本行为。</p><h2 id="子类指针向基类指针的转换" tabindex="-1"><a class="header-anchor" href="#子类指针向基类指针的转换"><span>子类指针向基类指针的转换</span></a></h2><p>哦，我撒了一个小谎。不知道你注意到没有，一个 <code>circle*</code> 是可以隐式转换成 <code>shape*</code> 的，但上面的 <code>smart_ptr&amp;lt;circle&amp;gt;</code> 却无法自动转换成 <code>smart_ptr&amp;lt;shape&amp;gt;</code>。这个行为显然还是不够“自然”。</p><p>不过，只需要额外加一点模板代码，就能实现这一行为。在我们目前给出的实现里，只需要增加一个构造函数即可——这也算是我们让赋值函数利用构造函数的好处了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(smart_ptr&amp;lt;U&amp;gt;&amp;amp;&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.release();</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们自然而然利用了指针的转换特性：现在 <code>smart_ptr&amp;lt;circle&amp;gt;</code> 可以移动给 <code>smart_ptr&amp;lt;shape&amp;gt;</code>，但不能移动给 <code>smart_ptr&amp;lt;triangle&amp;gt;</code>。不正确的转换会在代码编译时直接报错。</p><p>需要注意，上面这个构造函数不被编译器看作移动构造函数，因而不能自动触发删除拷贝构造函数的行为。如果我们想消除代码重复、删除移动构造函数的话，就需要把拷贝构造函数标记成 <code>= delete</code> 了（见“拷贝构造和赋值”一节）。不过，更通用的方式仍然是同时定义标准的拷贝/移动构造函数和所需的模板构造函数。下面的引用计数智能指针里我们就需要这么做。</p><p>至于非隐式的转换，因为本来就是要写特殊的转换函数的，我们留到这一讲的最后再讨论。</p><h2 id="引用计数" tabindex="-1"><a class="header-anchor" href="#引用计数"><span>引用计数</span></a></h2><p><code>unique_ptr</code> 算是一种较为安全的智能指针了。但是，一个对象只能被单个 <code>unique_ptr</code> 所拥有，这显然不能满足所有使用场合的需求。一种常见的情况是，多个智能指针同时拥有一个对象；当它们全部都失效时，这个对象也同时会被删除。这也就是 <code>shared_ptr</code> 了。</p><p><code>unique_ptr</code> 和 <code>shared_ptr</code> 的主要区别如下图所示：</p><img src="https://static001.geekbang.org/resource/image/07/c8/072fc41e503d22c3ab2bf6a3801903c8.png" alt=""><p>多个不同的 <code>shared_ptr</code> 不仅可以共享一个对象，在共享同一对象时也需要同时共享同一个计数。当最后一个指向对象（和共享计数）的 <code>shared_ptr</code> 析构时，它需要删除对象和共享计数。我们下面就来实现一下。</p><p>我们先来写出共享计数的接口：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class shared_count {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  shared_count();</span></span>
<span class="line"><span>  void add_count();</span></span>
<span class="line"><span>  long reduce_count();</span></span>
<span class="line"><span>  long get_count() const;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个 <code>shared_count</code> 类除构造函数之外有三个方法：一个增加计数，一个减少计数，一个获取计数。注意上面的接口增加计数不需要返回计数值；但减少计数时需要返回计数值，以供调用者判断是否它已经是最后一个指向共享计数的 <code>shared_ptr</code> 了。由于真正多线程安全的版本需要用到我们目前还没学到的知识，我们目前先实现一个简单化的版本：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class shared_count {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  shared_count() : count_(1) {}</span></span>
<span class="line"><span>  void add_count()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ++count_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  long reduce_count()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return --count_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  long get_count() const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return count_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  long count_;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我们可以实现我们的引用计数智能指针了。首先是构造函数、析构函数和私有成员变量：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  explicit smart_ptr(T* ptr = nullptr)</span></span>
<span class="line"><span>    : ptr_(ptr)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (ptr) {</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        new shared_count();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ~smart_ptr()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (ptr_ &amp;amp;&amp;amp;</span></span>
<span class="line"><span>      !shared_count_</span></span>
<span class="line"><span>         -&amp;gt;reduce_count()) {</span></span>
<span class="line"><span>      delete ptr_;</span></span>
<span class="line"><span>      delete shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  T* ptr_;</span></span>
<span class="line"><span>  shared_count* shared_count_;</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构造函数跟之前的主要不同点是会构造一个 <code>shared_count</code> 出来。析构函数在看到 <code>ptr_</code> 非空时（此时根据代码逻辑，<code>shared_count</code> 也必然非空），需要对引用数减一，并在引用数降到零时彻底删除对象和共享计数。原理就是这样，不复杂。</p><p>当然，我们还有些细节要处理。为了方便实现赋值（及其他一些惯用法），我们需要一个新的 <code>swap</code> 成员函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  void swap(smart_ptr&amp;amp; rhs)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    using std::swap;</span></span>
<span class="line"><span>    swap(ptr_, rhs.ptr_);</span></span>
<span class="line"><span>    swap(shared_count_,</span></span>
<span class="line"><span>         rhs.shared_count_);</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>赋值函数可以跟前面一样，保持不变，但拷贝构造和移动构造函数是需要更新一下的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  smart_ptr(const smart_ptr&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.ptr_;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      other.shared_count_</span></span>
<span class="line"><span>        -&amp;gt;add_count();</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.ptr_;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      other.shared_count_</span></span>
<span class="line"><span>        -&amp;gt;add_count();</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(smart_ptr&amp;lt;U&amp;gt;&amp;amp;&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.ptr_;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>      other.ptr_ = nullptr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除复制指针之外，对于拷贝构造的情况，我们需要在指针非空时把引用数加一，并复制共享计数的指针。对于移动构造的情况，我们不需要调整引用数，直接把 <code>other.ptr_</code> 置为空，认为 <code>other</code> 不再指向该共享对象即可。</p><p>不过，上面的代码有个问题：它不能正确编译。编译器会报错，像：</p><blockquote></blockquote><p>fatal error: ‘ptr_’ is a private member of ‘smart_ptr&lt;circle&gt;’</p><p>错误原因是模板的各个实例间并不天然就有 friend 关系，因而不能互访私有成员 <code>ptr_</code> 和 <code>shared_count_</code>。我们需要在 <code>smart_ptr</code> 的定义中显式声明：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  friend class smart_ptr;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>此外，我们之前的实现（类似于单一所有权的 <code>unique_ptr</code> ）中用 <code>release</code> 来手工释放所有权。在目前的引用计数实现中，它就不太合适了，应当删除。但我们要加一个对调试非常有用的函数，返回引用计数值。定义如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  long use_count() const</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      return shared_count_</span></span>
<span class="line"><span>        -&amp;gt;get_count();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就差不多是一个比较完整的引用计数智能指针的实现了。我们可以用下面的代码来验证一下它的功能正常：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class shape {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  virtual ~shape() {}</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class circle : public shape {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  ~circle() { puts(&quot;~circle()&quot;); }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  smart_ptr&amp;lt;circle&amp;gt; ptr1(new circle());</span></span>
<span class="line"><span>  printf(&quot;use count of ptr1 is %ld\\n&quot;,</span></span>
<span class="line"><span>         ptr1.use_count());</span></span>
<span class="line"><span>  smart_ptr&amp;lt;shape&amp;gt; ptr2;</span></span>
<span class="line"><span>  printf(&quot;use count of ptr2 was %ld\\n&quot;,</span></span>
<span class="line"><span>         ptr2.use_count());</span></span>
<span class="line"><span>  ptr2 = ptr1;</span></span>
<span class="line"><span>  printf(&quot;use count of ptr2 is now %ld\\n&quot;,</span></span>
<span class="line"><span>         ptr2.use_count());</span></span>
<span class="line"><span>  if (ptr1) {</span></span>
<span class="line"><span>    puts(&quot;ptr1 is not empty&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码的运行结果是：</p><blockquote></blockquote><p>\`use count of ptr1 is 1\`<br> \`use count of ptr2 was 0\`<br> \`use count of ptr2 is now 2\`<br> \`ptr1 is not empty\`<br> \`~circle()\`</p><p>上面我们可以看到引用计数的变化，以及最后对象被成功删除。</p><h2 id="指针类型转换" tabindex="-1"><a class="header-anchor" href="#指针类型转换"><span>指针类型转换</span></a></h2><p>对应于 C++ 里的不同的类型强制转换：</p><ul><li>static_cast</li><li>reinterpret_cast</li><li>const_cast</li><li>dynamic_cast</li></ul><p>智能指针需要实现类似的函数模板。实现本身并不复杂，但为了实现这些转换，我们需要添加构造函数，允许在对智能指针内部的指针对象赋值时，使用一个现有的智能指针的共享计数。如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other,</span></span>
<span class="line"><span>            T* ptr)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = ptr;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      other.shared_count_</span></span>
<span class="line"><span>        -&amp;gt;add_count();</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我们就可以实现转换所需的函数模板了。下面实现一个 <code>dynamic_pointer_cast</code> 来示例一下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>template &amp;lt;typename T, typename U&amp;gt;</span></span>
<span class="line"><span>smart_ptr&amp;lt;T&amp;gt; dynamic_pointer_cast(</span></span>
<span class="line"><span>  const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  T* ptr =</span></span>
<span class="line"><span>    dynamic_cast&amp;lt;T*&amp;gt;(other.get());</span></span>
<span class="line"><span>  return smart_ptr&amp;lt;T&amp;gt;(other, ptr);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在前面的验证代码后面我们可以加上：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  smart_ptr&amp;lt;circle&amp;gt; ptr3 =</span></span>
<span class="line"><span>    dynamic_pointer_cast&amp;lt;circle&amp;gt;(ptr2);</span></span>
<span class="line"><span>  printf(&quot;use count of ptr3 is %ld\\n&quot;,</span></span>
<span class="line"><span>         ptr3.use_count());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译会正常通过，同时能在输出里看到下面的结果：</p><blockquote></blockquote><p>use count of ptr3 is 3</p><p>最后，对象仍然能够被正确删除。这说明我们的实现是正确的。</p><h2 id="代码列表" tabindex="-1"><a class="header-anchor" href="#代码列表"><span>代码列表</span></a></h2><p>为了方便你参考，下面我给出了一个完整的 <code>smart_ptr</code> 代码列表：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;utility&amp;gt;  // std::swap</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class shared_count {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  shared_count() noexcept</span></span>
<span class="line"><span>    : count_(1) {}</span></span>
<span class="line"><span>  void add_count() noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ++count_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  long reduce_count() noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return --count_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  long get_count() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return count_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  long count_;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>class smart_ptr {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  friend class smart_ptr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  explicit smart_ptr(T* ptr = nullptr)</span></span>
<span class="line"><span>    : ptr_(ptr)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (ptr) {</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        new shared_count();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  ~smart_ptr()</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (ptr_ &amp;amp;&amp;amp;</span></span>
<span class="line"><span>      !shared_count_</span></span>
<span class="line"><span>         -&amp;gt;reduce_count()) {</span></span>
<span class="line"><span>      delete ptr_;</span></span>
<span class="line"><span>      delete shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  smart_ptr(const smart_ptr&amp;amp; other)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.ptr_;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      other.shared_count_</span></span>
<span class="line"><span>        -&amp;gt;add_count();</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other) noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.ptr_;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      other.shared_count_-&amp;gt;add_count();</span></span>
<span class="line"><span>      shared_count_ = other.shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(smart_ptr&amp;lt;U&amp;gt;&amp;amp;&amp;amp; other) noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = other.ptr_;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>      other.ptr_ = nullptr;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  template &amp;lt;typename U&amp;gt;</span></span>
<span class="line"><span>  smart_ptr(const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other,</span></span>
<span class="line"><span>            T* ptr) noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    ptr_ = ptr;</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      other.shared_count_</span></span>
<span class="line"><span>        -&amp;gt;add_count();</span></span>
<span class="line"><span>      shared_count_ =</span></span>
<span class="line"><span>        other.shared_count_;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  smart_ptr&amp;amp;</span></span>
<span class="line"><span>  operator=(smart_ptr rhs) noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    rhs.swap(*this);</span></span>
<span class="line"><span>    return *this;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  T* get() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return ptr_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  long use_count() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    if (ptr_) {</span></span>
<span class="line"><span>      return shared_count_</span></span>
<span class="line"><span>        -&amp;gt;get_count();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      return 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  void swap(smart_ptr&amp;amp; rhs) noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    using std::swap;</span></span>
<span class="line"><span>    swap(ptr_, rhs.ptr_);</span></span>
<span class="line"><span>    swap(shared_count_,</span></span>
<span class="line"><span>         rhs.shared_count_);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  T&amp;amp; operator*() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return *ptr_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  T* operator-&amp;gt;() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return ptr_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  operator bool() const noexcept</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    return ptr_;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  T* ptr_;</span></span>
<span class="line"><span>  shared_count* shared_count_;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename T&amp;gt;</span></span>
<span class="line"><span>void swap(smart_ptr&amp;lt;T&amp;gt;&amp;amp; lhs,</span></span>
<span class="line"><span>          smart_ptr&amp;lt;T&amp;gt;&amp;amp; rhs) noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  lhs.swap(rhs);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename T, typename U&amp;gt;</span></span>
<span class="line"><span>smart_ptr&amp;lt;T&amp;gt; static_pointer_cast(</span></span>
<span class="line"><span>  const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other) noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  T* ptr = static_cast&amp;lt;T*&amp;gt;(other.get());</span></span>
<span class="line"><span>  return smart_ptr&amp;lt;T&amp;gt;(other, ptr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename T, typename U&amp;gt;</span></span>
<span class="line"><span>smart_ptr&amp;lt;T&amp;gt; reinterpret_pointer_cast(</span></span>
<span class="line"><span>  const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other) noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  T* ptr = reinterpret_cast&amp;lt;T*&amp;gt;(other.get());</span></span>
<span class="line"><span>  return smart_ptr&amp;lt;T&amp;gt;(other, ptr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename T, typename U&amp;gt;</span></span>
<span class="line"><span>smart_ptr&amp;lt;T&amp;gt; const_pointer_cast(</span></span>
<span class="line"><span>  const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other) noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  T* ptr = const_cast&amp;lt;T*&amp;gt;(other.get());</span></span>
<span class="line"><span>  return smart_ptr&amp;lt;T&amp;gt;(other, ptr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &amp;lt;typename T, typename U&amp;gt;</span></span>
<span class="line"><span>smart_ptr&amp;lt;T&amp;gt; dynamic_pointer_cast(</span></span>
<span class="line"><span>  const smart_ptr&amp;lt;U&amp;gt;&amp;amp; other) noexcept</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  T* ptr = dynamic_cast&amp;lt;T*&amp;gt;(other.get());</span></span>
<span class="line"><span>  return smart_ptr&amp;lt;T&amp;gt;(other, ptr);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你足够细心的话，你会发现我在代码里加了不少 <code>noexcept</code>。这对这个智能指针在它的目标场景能正确使用是十分必要的。我们会在下面的几讲里回到这个话题。</p><h2 id="内容小结" tabindex="-1"><a class="header-anchor" href="#内容小结"><span>内容小结</span></a></h2><p>这一讲我们从 <code>shape_wrapper</code> 出发，实现了一个基本完整的带引用计数的智能指针。这个智能指针跟标准的 <code>shared_ptr</code> 比，还缺了一些东西（见参考资料 [2]），但日常用到的智能指针功能已经包含在内。现在，你应当已经对智能指针有一个较为深入的理解了。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>这里留几个问题，你可以思考一下：</p><ol><li>不查阅 <code>shared_ptr</code> 的文档，你觉得目前 <code>smart_ptr</code> 应当添加什么功能吗？</li><li>你想到的功能在标准的 <code>shared_ptr</code> 里吗？</li><li>你觉得智能指针应该满足什么样的线程安全性？</li></ol><p>欢迎留言和我交流你的看法。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>[1] Stack Overflow, GManNickG’s answer to “What is the copy-and-swap idiom?”. <a href="https://stackoverflow.com/a/3279550/816999" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/a/3279550/816999</a></p><p>[2] <a href="http://cppreference.com" target="_blank" rel="noopener noreferrer">cppreference.com</a>, “std::shared_ptr”. <a href="https://en.cppreference.com/w/cpp/memory/shared_ptr" target="_blank" rel="noopener noreferrer">https://en.cppreference.com/w/cpp/memory/shared_ptr</a></p>`,107)]))}const t=n(i,[["render",l]]),m=JSON.parse('{"path":"/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%9F%BA%E7%A1%80%E7%AF%87/02%20_%20%E8%87%AA%E5%B7%B1%E5%8A%A8%E6%89%8B%EF%BC%8C%E5%AE%9E%E7%8E%B0C__%E7%9A%84%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88.html","title":"02 _ 自己动手，实现C++的智能指针","lang":"zh-CN","frontmatter":{"description":"02 _ 自己动手，实现C++的智能指针 你好，我是吴咏炜。 上一讲，我们描述了一个某种程度上可以当成智能指针用的类 shape_wrapper。使用那个智能指针，可以简化资源的管理，从根本上消除资源（包括内存）泄漏的可能性。这一讲我们就来进一步讲解，如何将 shape_wrapper 改造成一个完整的智能指针。你会看到，智能指针本质上并不神秘，其实就...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%9F%BA%E7%A1%80%E7%AF%87/02%20_%20%E8%87%AA%E5%B7%B1%E5%8A%A8%E6%89%8B%EF%BC%8C%E5%AE%9E%E7%8E%B0C__%E7%9A%84%E6%99%BA%E8%83%BD%E6%8C%87%E9%92%88.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"02 _ 自己动手，实现C++的智能指针"}],["meta",{"property":"og:description","content":"02 _ 自己动手，实现C++的智能指针 你好，我是吴咏炜。 上一讲，我们描述了一个某种程度上可以当成智能指针用的类 shape_wrapper。使用那个智能指针，可以简化资源的管理，从根本上消除资源（包括内存）泄漏的可能性。这一讲我们就来进一步讲解，如何将 shape_wrapper 改造成一个完整的智能指针。你会看到，智能指针本质上并不神秘，其实就..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"02 _ 自己动手，实现C++的智能指针\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":14.54,"words":4362},"filePathRelative":"posts/现代C++实战30讲/基础篇/02 _ 自己动手，实现C++的智能指针.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"02 | 自己动手，实现C++的智能指针\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/b0/9a/b0ad5b326e15129171b567a6f5763d9a.mp3\\"></audio></p>\\n<p>你好，我是吴咏炜。</p>\\n<p>上一讲，我们描述了一个某种程度上可以当成智能指针用的类 <code>shape_wrapper</code>。使用那个智能指针，可以简化资源的管理，从根本上消除资源（包括内存）泄漏的可能性。这一讲我们就来进一步讲解，如何将 <code>shape_wrapper</code> 改造成一个完整的智能指针。你会看到，智能指针本质上并不神秘，其实就是 RAII 资源管理功能的自然展现而已。</p>","autoDesc":true}');export{t as comp,m as data};
