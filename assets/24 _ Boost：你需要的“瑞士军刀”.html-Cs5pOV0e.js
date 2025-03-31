import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as p,a,b as n,d as e,e as t,r as c,o as d}from"./app-6Bz2fGO5.js";const o={},r={id:"boostdemangle",tabindex:"-1"},m={class:"header-anchor",href:"#boostdemangle"};function v(u,s){const i=c("VPIcon");return d(),p("div",null,[s[2]||(s[2]=a(`<p><audio id="audio" title="24 | Boost：你需要的“瑞士军刀”" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/f1/95/f14698612ac9a15d134cee6431ce9b95.mp3"></audio></p><p>你好，我是吴咏炜。</p><p>我们已经零零碎碎提到过几次 Boost 了。作为 C++ 世界里标准库之外最知名的开放源码程序库，我们值得专门用一讲来讨论一下 Boost。</p><h2 id="boost-概览" tabindex="-1"><a class="header-anchor" href="#boost-概览"><span>Boost 概览</span></a></h2><p>Boost 的网站把 Boost 描述成为经过同行评审的、可移植的 C++ 源码库（peer-reviewed portable C++ source libraries）[1]。换句话说，它跟很多个人开源库不一样的地方在于，它的代码是经过评审的。事实上，Boost 项目的背后有很多 C++ 专家，比如发起人之一的 Dave Abarahams 是 C++ 标准委员会的成员，也是《C++ 模板元编程》一书 [2] 的作者。这也就使得 Boost 有了很不一样的特殊地位：它既是 C++ 标准库的灵感来源之一，也是 C++ 标准库的试验田。下面这些 C++ 标准库就源自 Boost：</p><ul><li>智能指针</li><li>thread</li><li>regex</li><li>random</li><li>array</li><li>bind</li><li>tuple</li><li>optional</li><li>variant</li><li>any</li><li>string_view</li><li>filesystem</li><li>等等</li></ul><p>当然，将来还会有新的库从 Boost 进入 C++ 标准，如网络库的标准化就是基于 Boost.Asio 进行的。因此，即使相关的功能没有被标准化，我们也可能可以从 Boost 里看到某个功能可能会被标准化的样子——当然，最终标准化之后的样子还是经常有所变化的。</p><p>我们也可以在我们的编译器落后于标准、不能提供标准库的某个功能时使用 Boost 里的替代品。比如，我之前提到过老版本的 macOS 上苹果的编译器不支持 optional 和 variant。除了我描述的不正规做法，改用 Boost 也是方法之一。比如，对于 variant，所需的改动只是：</p><ul><li>把包含 &lt;variant&gt; 改成包含 &lt;boost/variant.hpp&gt;</li><li>把代码中的 <code>std::variant</code> 改成 <code>boost::variant</code></li></ul><p>这样，就基本大功告成了。</p><p>作为一个准标准的库，很多环境里缺省会提供 Boost。这种情况下，在程序里使用 Boost 不会额外增加编译或运行时的依赖，减少了可能的麻烦。如果我需要某个功能，在标准库里没有，在 Boost 里有，我会很乐意直接使用 Boost 里的方案，而非另外去查找。如果我要使用非 Boost 的第三方库的话，那一般要么是 Boost 里没有，要么就是那个库比 Boost 里的要好用很多了。</p><p>鉴于 Boost 是一个库集合，当前版本（1.72）有 160 个独立库，即使写本书也不可能完整地讨论所有的库。这一讲里，我们也就管中窥豹式地浏览几个 Boost 库。具体你需要什么，还是得你自己回头去细细品味。</p><h3 id="boost-的安装" tabindex="-1"><a class="header-anchor" href="#boost-的安装"><span>Boost 的安装</span></a></h3><p>在主要的开发平台上，现在你都可以直接安装 Boost，而不需要自己从源代码编译了：</p><ul><li>在 Windows 下使用 MSVC，我们可以使用 NuGet 安装（按需逐个安装）</li><li>在 Linux 下，我们可以使用系统的包管理器（如 apt 和 yum）安装（按需逐个安装，或一次性安装所有的开发需要的包）</li><li>在 macOS 下，我们可以使用 Homebrew 安装（一次性安装完整的 Boost）</li></ul><p>如果你在某个平台上使用非缺省的编译器，如在 Windows 上或 macOS 上使用 GCC，一般就需要自己编译了，具体步骤请参见 Boost 的文档。不过，很多 Boost 库是完全不需要编译的，只需要把头文件加到编译器能找到的路径里就可以——如我们上一讲讨论的 Boost.Multiprecision 就是这样。我们讨论 Boost 库的时候，也会提一下使用这个库是否需要链接某个 Boost 库——需要的话，也就意味着需要编译和安装这个 Boost 库。</p><h2 id="boost-typeindex" tabindex="-1"><a class="header-anchor" href="#boost-typeindex"><span>Boost.TypeIndex</span></a></h2><p>TypeIndex 是一个很轻量级的库，它不需要链接，解决的也是使用模板时的一个常见问题，如何精确地知道一个表达式或变量的类型。我们还是看一个例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;typeinfo&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;utility&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;vector&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/type_index.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using boost::typeindex::type_id;</span></span>
<span class="line"><span>using boost::typeindex::</span></span>
<span class="line"><span>  type_id_with_cvr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  vector&amp;lt;int&amp;gt; v;</span></span>
<span class="line"><span>  auto it = v.cbegin();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;*** Using typeid\\n&quot;;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; typeid(const int).name()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; typeid(v).name() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; typeid(it).name() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;*** Using type_id\\n&quot;;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; type_id&amp;lt;const int&amp;gt;() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; type_id&amp;lt;decltype(v)&amp;gt;()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; type_id&amp;lt;decltype(it)&amp;gt;()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;*** Using &quot;</span></span>
<span class="line"><span>          &quot;type_id_with_cvr\\n&quot;;</span></span>
<span class="line"><span>  cout</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; type_id_with_cvr&amp;lt;const int&amp;gt;()</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; type_id_with_cvr&amp;lt;decltype(</span></span>
<span class="line"><span>            (v))&amp;gt;()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; type_id_with_cvr&amp;lt;decltype(</span></span>
<span class="line"><span>            move((v)))&amp;gt;()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; type_id_with_cvr&amp;lt;decltype(</span></span>
<span class="line"><span>            (it))&amp;gt;()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码里，展示了标准的 <code>typeid</code> 和 Boost 的 <code>type_id</code> 和 <code>type_id_with_cvr</code> 的使用。它们的区别是：</p><ul><li><code>typeid</code> 是标准 C++ 的关键字，可以应用到变量或类型上，返回一个 <code>std::type_info</code>。我们可以用它的 <code>name</code> 成员函数把结果转换成一个字符串，但标准不保证这个字符串的可读性和唯一性。</li><li><code>type_id</code> 是 Boost 提供的函数模板，必须提供类型作为模板参数——所以对于表达式和变量我们需要使用 <code>decltype</code>。结果可以直接输出到 IO 流上。</li><li><code>type_id_with_cvr</code> 和 <code>type_id</code> 相似，但它获得的结果会包含 const/volatile 状态及引用类型。</li></ul><p>上面程序在 MSVC 下的输出为：</p><blockquote></blockquote><p>\`*** Using typeid\`<br> \`int\`<br> \`class std::vector&lt;int,class std::allocator&lt;int&gt; &gt;\`<br> \`class std::_Vector_const_iterator&lt;class std::_Vector_val&lt;struct std::_Simple_types&lt;int&gt; &gt; &gt;\`<br> \`*** Using type_id\`<br> \`int\`<br> \`class std::vector&lt;int,class std::allocator&lt;int&gt; &gt;\`<br> \`class std::_Vector_const_iterator&lt;class std::_Vector_val&lt;struct std::_Simple_types&lt;int&gt; &gt; &gt;\`<br> \`*** Using type_id_with_cvr\`<br> \`int const\`<br> \`class std::vector&lt;int,class std::allocator&lt;int&gt; &gt; &amp;\`<br> \`class std::vector&lt;int,class std::allocator&lt;int&gt; &gt; &amp;&amp;\`<br> \`class std::_Vector_const_iterator&lt;class std::_Vector_val&lt;struct std::_Simple_types&lt;int&gt; &gt; &gt; &amp;\`</p><p>在 GCC 下的输出为：</p><blockquote></blockquote><p>\`*** Using typeid\`<br> \`i\`<br> \`St6vectorIiSaIiEE\`<br> \`N9__gnu_cxx17__normal_iteratorIPKiSt6vectorIiSaIiEEEE\`<br> \`*** Using type_id\`<br> \`int\`<br> \`std::vector&lt;int, std::allocator&lt;int&gt; &gt;\`<br> \`__gnu_cxx::__normal_iterator&lt;int const*, std::vector&lt;int, std::allocator&lt;int&gt; &gt; &gt;\`<br> \`*** Using type_id_with_cvr\`<br> \`int const\`<br> \`std::vector&lt;int, std::allocator&lt;int&gt; &gt;&amp;\`<br> \`std::vector&lt;int, std::allocator&lt;int&gt; &gt;&amp;&amp;\`<br> \`__gnu_cxx::__normal_iterator&lt;int const*, std::vector&lt;int, std::allocator&lt;int&gt; &gt; &gt;&amp;\`</p><p>我们可以看到 MSVC 下 <code>typeid</code> 直接输出了比较友好的类型名称，但 GCC 下没有。此外，我们可以注意到：</p><ul><li><code>typeid</code> 的输出忽略了 const 修饰，也不能输出变量的引用类型。</li><li><code>type_id</code> 保证可以输出友好的类型名称，输出时也不需要调用成员函数，但例子里它忽略了 <code>int</code> 的 const 修饰，也和 <code>typeid</code> 一样不能输出表达式的引用类型。</li><li><code>type_id_with_cvr</code> 可以输出 const/volatile 状态和引用类型，注意这种情况下模板参数必须包含引用类型，所以我用了 <code>decltype((v))</code> 这种写法，而不是 <code>decltype(v)</code>。如果你忘了这两者的区别，请复习一下<a href="https://time.geekbang.org/column/article/176850" target="_blank" rel="noopener noreferrer">[第 8 讲]</a> 的 <code>decltype</code>。</li></ul><p>显然，除非你正在使用 MSVC，否则调试期 <code>typeid</code> 的用法完全应该用 Boost 的 <code>type_id</code> 来替代。另外，如果你的开发环境要求禁用 RTTI（运行时类型识别），那 <code>typeid</code> 在 Clang 和 GCC 下根本不能使用，而使用 Boost.TypeIndex 库仍然没有问题。</p><p>当然，上面说的前提都是你在调试中试图获得变量的类型，而不是要获得一个多态对象的运行时类型。后者还是离不开 RTTI 的——虽然你也可以用一些其他方式来模拟 RTTI，但我个人觉得一般的项目不太有必要这样做。下面的代码展示了 <code>typeid</code> 和 <code>type_id</code> 在获取对象类型上的差异：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;typeinfo&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/type_index.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using boost::typeindex::type_id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class shape {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  virtual ~shape() {}</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class circle : public shape {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define CHECK_TYPEID(object, type) \\</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;typeid(&quot; #object &amp;lt;&amp;lt; &quot;)&quot; \\</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; (typeid(object) ==       \\</span></span>
<span class="line"><span>               typeid(type)        \\</span></span>
<span class="line"><span>             ? &quot; is &quot;              \\</span></span>
<span class="line"><span>             : &quot; is NOT &quot;)         \\</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; #type &amp;lt;&amp;lt; endl</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define CHECK_TYPE_ID(object,      \\</span></span>
<span class="line"><span>                      type)        \\</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;type_id(&quot; #object       \\</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; &quot;)&quot;                      \\</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; (type_id&amp;lt;decltype(       \\</span></span>
<span class="line"><span>                 object)&amp;gt;() ==     \\</span></span>
<span class="line"><span>               type_id&amp;lt;type&amp;gt;()     \\</span></span>
<span class="line"><span>             ? &quot; is &quot;              \\</span></span>
<span class="line"><span>             : &quot; is NOT &quot;)         \\</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; #type &amp;lt;&amp;lt; endl</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  shape* ptr = new circle();</span></span>
<span class="line"><span>  CHECK_TYPEID(*ptr, shape);</span></span>
<span class="line"><span>  CHECK_TYPEID(*ptr, circle);</span></span>
<span class="line"><span>  CHECK_TYPE_ID(*ptr, shape);</span></span>
<span class="line"><span>  CHECK_TYPE_ID(*ptr, circle);</span></span>
<span class="line"><span>  delete ptr;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出为：</p><blockquote></blockquote><p>\`typeid(*ptr) is NOT shape\`<br> \`typeid(*ptr) is circle\`<br> \`type_id(*ptr) is shape\`<br> \`type_id(*ptr) is NOT circle\`</p><h2 id="boost-core" tabindex="-1"><a class="header-anchor" href="#boost-core"><span>Boost.Core</span></a></h2><p>Core 里面提供了一些通用的工具，这些工具常常被 Boost 的其他库用到，而我们也可以使用，不需要链接任何库。在这些工具里，有些已经（可能经过一些变化后）进入了 C++ 标准，如：</p><ul><li><code>addressof</code>，在即使用户定义了 <code>operator&amp;amp;</code> 时也能获得对象的地址</li><li><code>enable_if</code>，这个我们已经深入讨论过了（<a href="https://time.geekbang.org/column/article/181636" target="_blank" rel="noopener noreferrer">[第 14 讲]</a>）</li><li><code>is_same</code>，判断两个类型是否相同，C++11 开始在 &lt;type_traits&gt; 中定义</li><li><code>ref</code>，和标准库的相同，我们在<a href="https://time.geekbang.org/column/article/186689" target="_blank" rel="noopener noreferrer">[第 19 讲]</a> 讨论线程时用过</li></ul><p>我们在剩下的里面来挑几个讲讲。</p>`,39)),n("h3",r,[n("a",m,[n("span",null,[s[0]||(s[0]=e("boost")),t(i,{icon:"core"}),s[1]||(s[1]=e("demangle"))])])]),s[3]||(s[3]=a(`<p><code>boost::core::demangle</code> 能够用来把 <code>typeid</code> 返回的内部名称“反粉碎”（demangle）成可读的形式，看代码和输出应该就非常清楚了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;typeinfo&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;vector&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/core/demangle.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using boost::core::demangle;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  vector&amp;lt;int&amp;gt; v;</span></span>
<span class="line"><span>  auto it = v.cbegin();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;*** Using typeid\\n&quot;;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; typeid(const int).name()</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; typeid(v).name() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; typeid(it).name() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; &quot;*** Demangled\\n&quot;;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; demangle(typeid(const int)</span></span>
<span class="line"><span>                     .name())</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; demangle(typeid(v).name())</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; demangle(</span></span>
<span class="line"><span>            typeid(it).name())</span></span>
<span class="line"><span>       &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>GCC 下的输出为：</p><blockquote></blockquote><p>\`*** Using typeid\`<br> \`i\`<br> \`St6vectorIiSaIiEE\`<br> \`N9__gnu_cxx17__normal_iteratorIPKiSt6vectorIiSaIiEEEE\`<br> \`*** Demangled\`<br> \`int\`<br> \`std::vector&lt;int, std::allocator&lt;int&gt; &gt;\`<br> \`__gnu_cxx::__normal_iterator&lt;int const*, std::vector&lt;int, std::allocator&lt;int&gt; &gt; &gt;\`</p><p>如果你不使用 RTTI 的话，那直接使用 TypeIndex 应该就可以。如果你需要使用 RTTI、又不是（只）使用 MSVC 的话，<code>demangle</code> 就会给你不少帮助。</p><h3 id="boost-noncopyable" tabindex="-1"><a class="header-anchor" href="#boost-noncopyable"><span>boost::noncopyable</span></a></h3><p><code>boost::noncopyable</code> 提供了一种非常简单也很直白的把类声明成不可拷贝的方式。比如，我们<a href="https://time.geekbang.org/column/article/169225" target="_blank" rel="noopener noreferrer">[第 1 讲]</a> 里的 <code>shape_wrapper</code>，用下面的写法就明确表示了它不允许被拷贝：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;boost/core/noncopyable.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class shape_wrapper</span></span>
<span class="line"><span>  : private boost::noncopyable {</span></span>
<span class="line"><span>  …</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你当然也可以自己把拷贝构造和拷贝赋值函数声明成 <code>= delete</code>，不过，上面的写法是不是可读性更佳？</p><h3 id="boost-swap" tabindex="-1"><a class="header-anchor" href="#boost-swap"><span>boost::swap</span></a></h3><p>你有没有印象在通用的代码如何对一个不知道类型的对象执行交换操作？不记得的话，标准做法是这样的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>{</span></span>
<span class="line"><span>  using std::swap;</span></span>
<span class="line"><span>  swap(lhs, rhs);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>即，我们需要（在某个小作用域里）引入 <code>std::swap</code>，然后让编译器在“看得到” <code>std::swap</code> 的情况下去编译 <code>swap</code> 指令。根据 ADL，如果在被交换的对象所属类型的名空间下有 <code>swap</code> 函数，那个函数会被优先使用，否则，编译器会选择通用的 <code>std::swap</code>。</p><p>似乎有点小啰嗦。使用 Boost 的话，你可以一行搞定：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>boost::swap(lhs, rhs);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>当然，你需要包含头文件 &lt;boost/core/swap.hpp&gt;。</p><h2 id="boost-conversion" tabindex="-1"><a class="header-anchor" href="#boost-conversion"><span>Boost.Conversion</span></a></h2><p>Conversion 同样是一个不需要链接的轻量级的库。它解决了标准 C++ 里的另一个问题，标准类型之间的转换不够方便。在 C++11 之前，这个问题尤为严重。在 C++11 里，标准引入了一系列的函数，已经可以满足常用类型之间的转换。但使用 Boost.Conversion 里的 <code>lexical_cast</code> 更不需要去查阅方法名称或动脑子去努力记忆。</p><p>下面是一个例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdexcept&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/lexical_cast.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using boost::bad_lexical_cast;</span></span>
<span class="line"><span>using boost::lexical_cast;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  // 整数到字符串的转换</span></span>
<span class="line"><span>  int d = 42;</span></span>
<span class="line"><span>  auto d_str =</span></span>
<span class="line"><span>    lexical_cast&amp;lt;string&amp;gt;(d);</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; d_str &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 字符串到浮点数的转换</span></span>
<span class="line"><span>  auto f =</span></span>
<span class="line"><span>    lexical_cast&amp;lt;float&amp;gt;(d_str) /</span></span>
<span class="line"><span>    4.0;</span></span>
<span class="line"><span>  cout &amp;lt;&amp;lt; f &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 测试 lexical_cast 的转换异常</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    int t = lexical_cast&amp;lt;int&amp;gt;(&quot;x&quot;);</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; t &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (bad_lexical_cast&amp;amp; e) {</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 测试标准库 stoi 的转换异常</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    int t = std::stoi(&quot;x&quot;);</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; t &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (invalid_argument&amp;amp; e) {</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>GCC 下的输出为：</p><blockquote></blockquote><p>\`42\`<br> \`10.5\`<br> \`bad lexical cast: source type value could not be interpreted as target\`<br> \`stoi\`</p><p>我觉得 GCC 里 <code>stoi</code> 的异常输出有点太言简意赅了……而 <code>lexical_cast</code> 的异常输出在不同的平台上有很好的一致性。</p><h2 id="boost-scopeexit" tabindex="-1"><a class="header-anchor" href="#boost-scopeexit"><span>Boost.ScopeExit</span></a></h2><p>我们说过 RAII 是推荐的 C++ 里管理资源的方式。不过，作为 C++ 程序员，跟 C 函数打交道也很正常。每次都写个新的 RAII 封装也有点浪费。Boost 里提供了一个简单的封装，你可以从下面的示例代码里看到它是如何使用的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;stdio.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/scope_exit.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void test()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  FILE* fp = fopen(&quot;test.cpp&quot;, &quot;r&quot;);</span></span>
<span class="line"><span>  if (fp == NULL) {</span></span>
<span class="line"><span>    perror(&quot;Cannot open file&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  BOOST_SCOPE_EXIT(&amp;amp;fp) {</span></span>
<span class="line"><span>    if (fp) {</span></span>
<span class="line"><span>      fclose(fp);</span></span>
<span class="line"><span>      puts(&quot;File is closed&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } BOOST_SCOPE_EXIT_END</span></span>
<span class="line"><span>  puts(&quot;Faking an exception&quot;);</span></span>
<span class="line"><span>  throw 42;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    test();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (int) {</span></span>
<span class="line"><span>    puts(&quot;Exception received&quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>唯一需要说明的可能就是 <code>BOOST_SCOPE_EXIT</code> 里的那个 <code>&amp;amp;</code> 符号了——把它理解成 lambda 表达式的按引用捕获就对了（虽然 <code>BOOST_SCOPE_EXIT</code> 可以支持 C++98 的代码）。如果不需要捕获任何变量，<code>BOOST_SCOPE_EXIT</code> 的参数必须填为 <code>void</code>。</p><p>输出为（假设 test.cpp 存在）：</p><blockquote></blockquote><p>\`Faking an exception\`<br> \`File is closed\`<br> \`Exception received\`</p><p>使用这个库也只需要头文件。注意实现类似的功能在 C++11 里相当容易，但由于 ScopeExit 可以支持 C++98 的代码，因而它的实现还是相当复杂的。</p><h2 id="boost-program-options" tabindex="-1"><a class="header-anchor" href="#boost-program-options"><span>Boost.Program_options</span></a></h2><p>传统上 C 代码里处理命令行参数会使用 <code>getopt</code>。我也用过，比如在下面的代码中：</p><p><a href="https://github.com/adah1972/breaktext/blob/master/breaktext.c" target="_blank" rel="noopener noreferrer">https://github.com/adah1972/breaktext/blob/master/breaktext.c</a></p><p>这种方式有不少缺陷：</p><ul><li>一个选项通常要在三个地方重复：说明文本里，<code>getopt</code> 的参数里，以及对 <code>getopt</code> 的返回结果进行处理时。不知道你觉得怎样，我反正发生过改了一处、漏改其他的错误。</li><li>对选项的附加参数需要手工写代码处理，因而常常不够严格（C 的类型转换不够方便，尤其是检查错误）。</li></ul><p>Program_options 正是解决这个问题的。这个代码有点老了，不过还挺实用；懒得去找特别的处理库时，至少这个伸手可用。使用这个库需要链接 boost_program_options 库。</p><p>下面的代码展示了代替上面的 <code>getopt</code> 用法的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;stdlib.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;boost/program_options.hpp&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace po = boost::program_options;</span></span>
<span class="line"><span>using std::cout;</span></span>
<span class="line"><span>using std::endl;</span></span>
<span class="line"><span>using std::string;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>string locale;</span></span>
<span class="line"><span>string lang;</span></span>
<span class="line"><span>int width = 72;</span></span>
<span class="line"><span>bool keep_indent = false;</span></span>
<span class="line"><span>bool verbose = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  po::options_description desc(</span></span>
<span class="line"><span>    &quot;Usage: breaktext [OPTION]... &quot;</span></span>
<span class="line"><span>    &quot;&amp;lt;Input File&amp;gt; [Output File]\\n&quot;</span></span>
<span class="line"><span>    &quot;\\n&quot;</span></span>
<span class="line"><span>    &quot;Available options&quot;);</span></span>
<span class="line"><span>  desc.add_options()</span></span>
<span class="line"><span>    (&quot;locale,L&quot;,</span></span>
<span class="line"><span>     po::value&amp;lt;string&amp;gt;(&amp;amp;locale),</span></span>
<span class="line"><span>     &quot;Locale of the console (system locale by default)&quot;)</span></span>
<span class="line"><span>    (&quot;lang,l&quot;,</span></span>
<span class="line"><span>     po::value&amp;lt;string&amp;gt;(&amp;amp;lang),</span></span>
<span class="line"><span>     &quot;Language of input (asssume no language by default)&quot;)</span></span>
<span class="line"><span>    (&quot;width,w&quot;,</span></span>
<span class="line"><span>     po::value&amp;lt;int&amp;gt;(&amp;amp;width),</span></span>
<span class="line"><span>     &quot;Width of output text (72 by default)&quot;)</span></span>
<span class="line"><span>    (&quot;help,h&quot;, &quot;Show this help message and exit&quot;)</span></span>
<span class="line"><span>    (&quot;,i&quot;,</span></span>
<span class="line"><span>     po::bool_switch(&amp;amp;keep_indent),</span></span>
<span class="line"><span>     &quot;Keep space indentation&quot;)</span></span>
<span class="line"><span>    (&quot;,v&quot;,</span></span>
<span class="line"><span>     po::bool_switch(&amp;amp;verbose),</span></span>
<span class="line"><span>     &quot;Be verbose&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  po::variables_map vm;</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    po::store(</span></span>
<span class="line"><span>      po::parse_command_line(</span></span>
<span class="line"><span>        argc, argv, desc),</span></span>
<span class="line"><span>      vm);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (po::error&amp;amp; e) {</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>    exit(1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  vm.notify();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (vm.count(&quot;help&quot;)) {</span></span>
<span class="line"><span>    cout &amp;lt;&amp;lt; desc &amp;lt;&amp;lt; &quot;\\n&quot;;</span></span>
<span class="line"><span>    exit(1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>略加说明一下：</p><ul><li><code>options_description</code> 是基本的选项描述对象的类型，构造时我们给出对选项的基本描述。</li><li><code>options_description</code> 对象的 <code>add_options</code> 成员函数会返回一个函数对象，然后我们直接用括号就可以添加一系列的选项。</li><li>每个选项初始化时可以有两个或三个参数，第一项是选项的形式，使用长短选项用逗号隔开的字符串（可以只提供一种），最后一项是选项的文字描述，中间如果还有一项的话，就是选项的值描述。</li><li>选项的值描述可以用 <code>value</code>、<code>bool_switch</code> 等方法，参数是输出变量的指针。</li><li><code>variables_map</code>，变量映射表，用来存储对命令行的扫描结果；它继承了标准的 <code>std::map</code>。</li><li><code>notify</code> 成员函数用来把变量映射表的内容实际传送到选项值描述里提供的那些变量里去。</li><li><code>count</code> 成员函数继承自 <code>std::map</code>，只能得到 0 或 1 的结果。</li></ul><p>这样，我们的程序就能处理上面的那些选项了。如果运行时在命令行加上 <code>-h</code> 或 <code>--help</code> 选项，程序就会输出跟原来类似的帮助输出——额外的好处是选项的描述信息较长时还能自动帮你折行，不需要手工排版了。建议你自己尝试一下，提供各种正确或错误的选项，来检查一下运行的结果。</p><p>当然现在有些更新的选项处理库，但它们应该都和 Program_options 更接近，而不是和 <code>getopt</code> 更接近。如果你感觉 Program_options 功能不足了，换一个其他库不会是件麻烦事。</p><h2 id="boost-hana" tabindex="-1"><a class="header-anchor" href="#boost-hana"><span>Boost.Hana</span></a></h2><p>Boost 里自然也有模板元编程相关的东西。但我不打算介绍 MPL、Fusion 和 Phoenix 那些，因为有些技巧，在 C++11 和 Lambda 表达式到来之后，已经略显得有点过时了。Hana 则不同，它是一个使用了 C++11/14 实现技巧和惯用法的新库，也和一般的模板库一样，只要有头文件就能使用。</p><p>Hana 里定义了一整套供<strong>编译期</strong>使用的数据类型和函数。我们现在看一下它提供的部分类型：</p><ul><li><code>type</code>：把类型转化成对象（我们在<a href="https://time.geekbang.org/column/article/181608" target="_blank" rel="noopener noreferrer">[第 13 讲]</a> 曾经示例过相反的动作，把数值转化成对象），来方便后续处理。</li><li><code>integral_constant</code>：跟 <code>std::integral_constant</code> 相似，但定义了更多的运算符和语法糖。特别的，你可以用字面量来生成一个 <code>long long</code> 类型的 <code>integral_constant</code>，如 <code>1_c</code>。</li><li><code>string</code>：一个编译期使用的字符串类型。</li><li><code>tuple</code>：跟 <code>std::tuple</code> 类似，意图是当作编译期的 <code>vector</code> 来使用。</li><li><code>map</code>：编译期使用的关联数组。</li><li><code>set</code>：编译期使用的集合。</li></ul><p>Hana 里的算法的名称跟标准库的类似，我就不一一列举了。下面的例子展示了一个基本用法：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;boost/hana.hpp&amp;gt;</span></span>
<span class="line"><span>namespace hana = boost::hana;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class shape {};</span></span>
<span class="line"><span>class circle {};</span></span>
<span class="line"><span>class triangle {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  using namespace hana::literals;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  constexpr auto tup =</span></span>
<span class="line"><span>    hana::make_tuple(</span></span>
<span class="line"><span>      hana::type_c&amp;lt;shape*&amp;gt;,</span></span>
<span class="line"><span>      hana::type_c&amp;lt;circle&amp;gt;,</span></span>
<span class="line"><span>      hana::type_c&amp;lt;triangle&amp;gt;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  constexpr auto no_pointers =</span></span>
<span class="line"><span>    hana::remove_if(</span></span>
<span class="line"><span>      tup, [](auto a) {</span></span>
<span class="line"><span>        return hana::traits::</span></span>
<span class="line"><span>          is_pointer(a);</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static_assert(</span></span>
<span class="line"><span>    no_pointers ==</span></span>
<span class="line"><span>    hana::make_tuple(</span></span>
<span class="line"><span>      hana::type_c&amp;lt;circle&amp;gt;,</span></span>
<span class="line"><span>      hana::type_c&amp;lt;triangle&amp;gt;));</span></span>
<span class="line"><span>  static_assert(</span></span>
<span class="line"><span>    hana::reverse(no_pointers) ==</span></span>
<span class="line"><span>    hana::make_tuple(</span></span>
<span class="line"><span>      hana::type_c&amp;lt;triangle&amp;gt;,</span></span>
<span class="line"><span>      hana::type_c&amp;lt;circle&amp;gt;));</span></span>
<span class="line"><span>  static_assert(</span></span>
<span class="line"><span>    tup[1_c] == hana::type_c&amp;lt;circle&amp;gt;);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个程序可以编译，但没有任何运行输出。在这个程序里，我们做了下面这几件事：</p><ul><li>使用 <code>type_c</code> 把类型转化成 <code>type</code> 对象，并构造了类型对象的 <code>tuple</code></li><li>使用 <code>remove_if</code> 算法移除了 <code>tup</code> 中的指针类型</li><li>使用静态断言确认了结果是我们想要的</li><li>使用静态断言确认了可以用 <code>reverse</code> 把 <code>tup</code> 反转一下</li><li>使用静态断言确认了可以用方括号运算符来获取 <code>tup</code> 中的某一项</li></ul><p>可以看到，Hana 本质上以类似普通的运行期编程的写法，来做编译期的计算。上面展示的只是一些最基本的用法，而 Hana 的文档里展示了很多有趣的用法。尤其值得一看的是，文档中展示了如何利用 Hana 提供的机制，来自己定义 <code>switch_</code>、<code>case_</code>、<code>default_</code>，使得下面的代码可以通过编译：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>boost::any a = &#39;x&#39;;</span></span>
<span class="line"><span>std::string r =</span></span>
<span class="line"><span>  switch_(a)(</span></span>
<span class="line"><span>    case_&amp;lt;int&amp;gt;([](auto i) {</span></span>
<span class="line"><span>      return &quot;int: &quot;s +</span></span>
<span class="line"><span>             std::to_string(i);</span></span>
<span class="line"><span>    }),</span></span>
<span class="line"><span>    case_&amp;lt;char&amp;gt;([](auto c) {</span></span>
<span class="line"><span>      return &quot;char: &quot;s +</span></span>
<span class="line"><span>             std::string{c};</span></span>
<span class="line"><span>    }),</span></span>
<span class="line"><span>    default_(</span></span>
<span class="line"><span>      [] { return &quot;unknown&quot;s; }));</span></span>
<span class="line"><span>assert(r == &quot;char: x&quot;s);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我个人认为很有意思。</p><h2 id="内容小结" tabindex="-1"><a class="header-anchor" href="#内容小结"><span>内容小结</span></a></h2><p>本讲我们对 Boost 的意义做了概要介绍，并蜻蜓点水地简单描述了若干 Boost 库的功能。如果你想进一步了解 Boost 的细节的话，就得自行查看文档了。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>请你考虑一下，我今天描述的 Boost 库里的功能是如何实现的。然后自己去看一下源代码（开源真是件大好事！），检查一下跟自己想象的是不是有出入。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>[1] Boost C++ Libraries. <a href="https://www.boost.org/" target="_blank" rel="noopener noreferrer">https://www.boost.org/</a></p><p>[2] David Abarahams and Aleksey Gurtovoy, <strong>C++ Template Metaprogramming</strong>. Addison-Wesley, 2004. 有中文版（荣耀译，机械工业出版社，2010 年）</p>`,63))])}const g=l(o,[["render",v]]),_=JSON.parse('{"path":"/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%AE%9E%E6%88%98%E7%AF%87/24%20_%20Boost%EF%BC%9A%E4%BD%A0%E9%9C%80%E8%A6%81%E7%9A%84%E2%80%9C%E7%91%9E%E5%A3%AB%E5%86%9B%E5%88%80%E2%80%9D.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是吴咏炜。 我们已经零零碎碎提到过几次 Boost 了。作为 C++ 世界里标准库之外最知名的开放源码程序库，我们值得专门用一讲来讨论一下 Boost。 Boost 概览 Boost 的网站把 Boost 描述成为经过同行评审的、可移植的 C++ 源码库（peer-reviewed portable C++ source libraries）[...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%AE%9E%E6%88%98%E7%AF%87/24%20_%20Boost%EF%BC%9A%E4%BD%A0%E9%9C%80%E8%A6%81%E7%9A%84%E2%80%9C%E7%91%9E%E5%A3%AB%E5%86%9B%E5%88%80%E2%80%9D.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是吴咏炜。 我们已经零零碎碎提到过几次 Boost 了。作为 C++ 世界里标准库之外最知名的开放源码程序库，我们值得专门用一讲来讨论一下 Boost。 Boost 概览 Boost 的网站把 Boost 描述成为经过同行评审的、可移植的 C++ 源码库（peer-reviewed portable C++ source libraries）[..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":17.06,"words":5117},"filePathRelative":"posts/现代C++实战30讲/实战篇/24 _ Boost：你需要的“瑞士军刀”.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"24 | Boost：你需要的“瑞士军刀”\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/f1/95/f14698612ac9a15d134cee6431ce9b95.mp3\\"></audio></p>\\n<p>你好，我是吴咏炜。</p>\\n<p>我们已经零零碎碎提到过几次 Boost 了。作为 C++ 世界里标准库之外最知名的开放源码程序库，我们值得专门用一讲来讨论一下 Boost。</p>\\n<h2>Boost 概览</h2>","autoDesc":true}');export{g as comp,_ as data};
