import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_27-c-rest-sdk-使用现代c-开发网络应用" tabindex="-1"><a class="header-anchor" href="#_27-c-rest-sdk-使用现代c-开发网络应用"><span>27 _ C++ REST SDK：使用现代C++开发网络应用</span></a></h1><p><audio id="audio" title="27 | C++ REST SDK：使用现代C++开发网络应用" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/44/78/44d5594c569500dc14cd9b55554a8078.mp3"></audio></p><p>你好，我是吴咏炜。</p><p>在实战篇，我们最后要讲解的一个库是 C++ REST SDK（也写作 cpprestsdk）[1]，一个支持 HTTP 协议 [2]、主要用于 RESTful [3] 接口开发的 C++ 库。</p><h2 id="初识-c-rest-sdk" tabindex="-1"><a class="header-anchor" href="#初识-c-rest-sdk"><span>初识 C++ REST SDK</span></a></h2><p>向你提一个问题，你认为用多少行代码可以写出一个类似于 curl [4] 的 HTTP 客户端？</p><p>使用 C++ REST SDK 的话，答案是，只需要五十多行有效代码（即使是适配到我们目前的窄小的手机屏幕上）。请看：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#include &amp;lt;fcntl.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;io.h&amp;gt;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#include &amp;lt;cpprest/http_client.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace utility;</span></span>
<span class="line"><span>using namespace web::http;</span></span>
<span class="line"><span>using namespace web::http::client;</span></span>
<span class="line"><span>using std::cerr;</span></span>
<span class="line"><span>using std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#define tcout std::wcout</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>#define tcout std::cout</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto get_headers(http_response resp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  auto headers = resp.to_string();</span></span>
<span class="line"><span>  auto end =</span></span>
<span class="line"><span>    headers.find(U(&quot;\\r\\n\\r\\n&quot;));</span></span>
<span class="line"><span>  if (end != string_t::npos) {</span></span>
<span class="line"><span>    headers.resize(end + 4);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  return headers;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto get_request(string_t uri)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  http_client client{uri};</span></span>
<span class="line"><span>  // 用 GET 方式发起一个客户端请求</span></span>
<span class="line"><span>  auto request =</span></span>
<span class="line"><span>    client.request(methods::GET)</span></span>
<span class="line"><span>      .then([](http_response resp) {</span></span>
<span class="line"><span>        if (resp.status_code() !=</span></span>
<span class="line"><span>            status_codes::OK) {</span></span>
<span class="line"><span>          // 不 OK，显示当前响应信息</span></span>
<span class="line"><span>          auto headers =</span></span>
<span class="line"><span>            get_headers(resp);</span></span>
<span class="line"><span>          tcout &amp;lt;&amp;lt; headers;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 进一步取出完整响应</span></span>
<span class="line"><span>        return resp</span></span>
<span class="line"><span>          .extract_string();</span></span>
<span class="line"><span>      })</span></span>
<span class="line"><span>      .then([](string_t str) {</span></span>
<span class="line"><span>        // 输出到终端</span></span>
<span class="line"><span>        tcout &amp;lt;&amp;lt; str;</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>  return request;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>int wmain(int argc, wchar_t* argv[])</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>  _setmode(_fileno(stdout),</span></span>
<span class="line"><span>           _O_WTEXT);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (argc != 2) {</span></span>
<span class="line"><span>    cerr &amp;lt;&amp;lt; &quot;A URL is needed\\n&quot;;</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 等待请求及其关联处理全部完成</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    auto request =</span></span>
<span class="line"><span>      get_request(argv[1]);</span></span>
<span class="line"><span>    request.wait();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 处理请求过程中产生的异常</span></span>
<span class="line"><span>  catch (const std::exception&amp;amp; e) {</span></span>
<span class="line"><span>    cerr &amp;lt;&amp;lt; &quot;Error exception: &quot;</span></span>
<span class="line"><span>         &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个代码有点复杂，需要讲解一下：</p><ul><li>第 14–18 行，我们根据平台来定义 <code>tcout</code>，确保多语言的文字能够正确输出。</li><li>第 20–29 行，我们定义了 <code>get_headers</code>，来从 <code>http_response</code> 中取出头部的字符串表示。</li><li>第 36 行，构造了一个客户端请求，并使用 <code>then</code> 方法串联了两个下一步的动作。<code>http_client::request</code> 的返回值是 <code>pplx::task&amp;lt;http_response&amp;gt;</code>。<code>then</code> 是 <code>pplx::task</code> 类模板的成员函数，参数是能接受其类型参数对象的函数对象。除了最后一个 <code>then</code> 块，其他每个 <code>then</code> 里都应该返回一个 <code>pplx::task</code>，而 <code>task</code> 的内部类型就是下一个 <code>then</code> 块里函数对象接受的参数的类型。</li><li>第 37 行开始，是第一段异步处理代码。参数类型是 <code>http_response</code>——因为<code>http_client::request</code> 的返回值是 <code>pplx::task&amp;lt;http_response&amp;gt;</code>。代码中判断如果响应的 HTTP 状态码不是 200 OK，就会显示响应头来帮助调试。然后，进一步取出所有的响应内容（可能需要进一步的异步处理，等待后续的 HTTP 响应到达）。</li><li>第 49 行开始，是第二段异步处理代码。参数类型是 <code>string_t</code>——因为上一段 <code>then</code> 块的返回值是 <code>pplx::task&amp;lt;string_t&amp;gt;</code>。代码中就是简单地把需要输出的内容输出到终端。</li><li>第 56–60 行，我们根据平台来定义合适的程序入口，确保命令行参数的正确处理。</li><li>第 62–65 行，在 Windows 上我们把标准输出设置成宽字符模式，来确保宽字符（串）能正确输出（参考<a href="https://time.geekbang.org/column/article/179357" target="_blank" rel="noopener noreferrer">[第 11 讲]</a> ）。注意 <code>string_t</code> 在 Windows 上是 <code>wstring</code>，在其他平台上是 <code>string</code>。</li><li>第 72–83 行，如注释所言，产生 HTTP 请求、等待 HTTP 请求完成，并处理相关的异常。</li></ul><p>整体而言，这个代码还是很简单的，虽然这种代码风格，对于之前没有接触过这种函数式编程风格的人来讲会有点奇怪——这被称作持续传递风格（continuation-passing style），显式地把上一段处理的结果传递到下一个函数中。这个代码已经处理了 Windows 环境和 Unix 环境的差异，底下是相当复杂的。</p><p>另外提醒一下，在 Windows 上如果你把源代码存成 UTF-8 的话，需要确保文件以 BOM 字符打头。Windows 的编辑器通常缺省就会做到；在 Vim 里，可以通过 <code>set bomb</code> 命令做到这一点。</p><h2 id="安装和编译" tabindex="-1"><a class="header-anchor" href="#安装和编译"><span>安装和编译</span></a></h2><p>上面的代码本身虽然简单，但要把它编译成可执行文件比我们之前讲的代码都要复杂——C++ REST SDK 有外部依赖，在 Windows 上和 Unix 上还不太一样。它的编译和安装也略复杂，如果你没有这方面的经验的话，建议尽量使用平台推荐的二进制包的安装方式。</p><p>由于其依赖较多，使用它的编译命令行也较为复杂。正式项目中绝对是需要使用项目管理软件的（如 cmake）。此处，我给出手工编译的典型命令行，仅供你尝试编译上面的例子作参考。</p><p>Windows MSVC：</p><blockquote></blockquote><p><code>cl /EHsc /std:c++17 test.cpp cpprest.lib zlib.lib libeay32.lib ssleay32.lib winhttp.lib httpapi.lib bcrypt.lib crypt32.lib advapi32.lib gdi32.lib user32.lib</code></p><p>Linux GCC：</p><blockquote></blockquote><p><code>g++ -std=c++17 -pthread test.cpp -lcpprest -lcrypto -lssl -lboost_thread -lboost_chrono -lboost_system</code></p><p>macOS Clang：</p><blockquote></blockquote><p><code>clang++ -std=c++17 test.cpp -lcpprest -lcrypto -lssl -lboost_thread-mt -lboost_chrono-mt</code></p><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>有了初步印象之后，现在我们可以回过头看看 C++ REST SDK 到底是什么了。它是一套用来开发 HTTP 客户端和服务器的现代异步 C++ 代码库，支持以下特性（随平台不同会有所区别）：</p><ul><li>HTTP 客户端</li><li>HTTP 服务器</li><li>任务</li><li>JSON</li><li>URI</li><li>异步流</li><li>WebSocket 客户端</li><li>OAuth 客户端</li></ul><p>上面的例子里用到了 HTTP 客户端、任务和 URI（实际上是由 <code>string_t</code> 隐式构造了 <code>uri</code>），我们下面再介绍一下异步流、JSON 和 HTTP 服务器。</p><h2 id="异步流" tabindex="-1"><a class="header-anchor" href="#异步流"><span>异步流</span></a></h2><p>C++ REST SDK 里实现了一套异步流，能够实现对文件的异步读写。下面的例子展示了我们如何把网络请求的响应异步地存储到文件 results.html 中：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;utility&amp;gt;</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#include &amp;lt;fcntl.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;io.h&amp;gt;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#include &amp;lt;stddef.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;cpprest/http_client.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;cpprest/filestream.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace utility;</span></span>
<span class="line"><span>using namespace web::http;</span></span>
<span class="line"><span>using namespace web::http::client;</span></span>
<span class="line"><span>using namespace concurrency::streams;</span></span>
<span class="line"><span>using std::cerr;</span></span>
<span class="line"><span>using std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#define tcout std::wcout</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>#define tcout std::cout</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto get_headers(http_response resp)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  auto headers = resp.to_string();</span></span>
<span class="line"><span>  auto end =</span></span>
<span class="line"><span>    headers.find(U(&quot;\\r\\n\\r\\n&quot;));</span></span>
<span class="line"><span>  if (end != string_t::npos) {</span></span>
<span class="line"><span>    headers.resize(end + 4);</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  return headers;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto get_request(string_t uri)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  http_client client{uri};</span></span>
<span class="line"><span>  // 用 GET 方式发起一个客户端请求</span></span>
<span class="line"><span>  auto request =</span></span>
<span class="line"><span>    client.request(methods::GET)</span></span>
<span class="line"><span>      .then([](http_response resp) {</span></span>
<span class="line"><span>        if (resp.status_code() ==</span></span>
<span class="line"><span>            status_codes::OK) {</span></span>
<span class="line"><span>          // 正常的话</span></span>
<span class="line"><span>          tcout &amp;lt;&amp;lt; U(&quot;Saving...\\n&quot;);</span></span>
<span class="line"><span>          ostream fs;</span></span>
<span class="line"><span>          fstream::open_ostream(</span></span>
<span class="line"><span>            U(&quot;results.html&quot;),</span></span>
<span class="line"><span>            std::ios_base::out |</span></span>
<span class="line"><span>              std::ios_base::trunc)</span></span>
<span class="line"><span>            .then(</span></span>
<span class="line"><span>              [&amp;amp;fs,</span></span>
<span class="line"><span>               resp](ostream os) {</span></span>
<span class="line"><span>                fs = os;</span></span>
<span class="line"><span>                // 读取网页内容到流</span></span>
<span class="line"><span>                return resp.body()</span></span>
<span class="line"><span>                  .read_to_end(</span></span>
<span class="line"><span>                    fs.streambuf());</span></span>
<span class="line"><span>              })</span></span>
<span class="line"><span>            .then(</span></span>
<span class="line"><span>              [&amp;amp;fs](size_t size) {</span></span>
<span class="line"><span>                // 然后关闭流</span></span>
<span class="line"><span>                fs.close();</span></span>
<span class="line"><span>                tcout</span></span>
<span class="line"><span>                  &amp;lt;&amp;lt; size</span></span>
<span class="line"><span>                  &amp;lt;&amp;lt; U(&quot; bytes &quot;</span></span>
<span class="line"><span>                       &quot;saved\\n&quot;);</span></span>
<span class="line"><span>              })</span></span>
<span class="line"><span>            .wait();</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          // 否则显示当前响应信息</span></span>
<span class="line"><span>          auto headers =</span></span>
<span class="line"><span>            get_headers(resp);</span></span>
<span class="line"><span>          tcout &amp;lt;&amp;lt; headers;</span></span>
<span class="line"><span>          tcout</span></span>
<span class="line"><span>            &amp;lt;&amp;lt; resp.extract_string()</span></span>
<span class="line"><span>                 .get();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>  return request;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>int wmain(int argc, wchar_t* argv[])</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>  _setmode(_fileno(stdout),</span></span>
<span class="line"><span>           _O_WTEXT);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (argc != 2) {</span></span>
<span class="line"><span>    cerr &amp;lt;&amp;lt; &quot;A URL is needed\\n&quot;;</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 等待请求及其关联处理全部完成</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    auto request =</span></span>
<span class="line"><span>      get_request(argv[1]);</span></span>
<span class="line"><span>    request.wait();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 处理请求过程中产生的异常</span></span>
<span class="line"><span>  catch (const std::exception&amp;amp; e) {</span></span>
<span class="line"><span>    cerr &amp;lt;&amp;lt; &quot;Error exception: &quot;</span></span>
<span class="line"><span>         &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跟上一个例子比，我们去掉了原先的第二段处理统一输出的异步处理代码，但加入了一段嵌套的异步代码。有几个地方需要注意一下：</p><ul><li>C++ REST SDK 的对象基本都是基于 <code>shared_ptr</code> 用引用计数实现的，因而可以轻松大胆地进行复制。</li><li>虽然 <code>string_t</code> 在 Windows 上是 <code>wstring</code>，但文件流无论在哪个平台上都是以 UTF-8 的方式写入，符合目前的主流处理方式（<code>wofstream</code> 的行为跟平台和环境相关）。</li><li><code>extract_string</code> 的结果这次没有传递到下一段，而是直接用 <code>get</code> 获得了最终结果（类似于<a href="https://time.geekbang.org/column/article/186689" target="_blank" rel="noopener noreferrer">[第 19 讲]</a> 中的 <code>future</code>）。</li></ul><p>这个例子的代码是基于 <a href="https://github.com/Microsoft/cpprestsdk/wiki/Getting-Started-Tutorial" target="_blank" rel="noopener noreferrer">cpprestsdk 官方的例子</a>改编的。但我做的下面这些更动值得提一下：</p><ul><li>去除了不必要的 <code>shared_ptr</code> 的使用。</li><li><code>fstream::open_ostream</code> 缺省的文件打开方式是 <code>std::ios_base::out</code>，官方例子没有用 <code>std::ios_base::trunc</code>，导致不能清除文件中的原有内容。此处 C++ REST SDK 的 <code>file_stream</code> 行为跟标准 C++ 的 <code>ofstream</code> 是不一样的：后者缺省打开方式也是 <code>std::ios_base::out</code>，但此时文件内容<strong>会</strong>被自动清除。</li><li>沿用我的前一个例子，先进行请求再打开文件流，而不是先打开文件流再发送网络请求，符合实际流程。</li><li>这样做的一个结果就是 <code>then</code> 不完全是顺序的了，有嵌套，增加了复杂度，但展示了实际可能的情况。</li></ul><h2 id="json-支持" tabindex="-1"><a class="header-anchor" href="#json-支持"><span>JSON 支持</span></a></h2><p>在基于网页的开发中，JSON [5] 早已取代 XML 成了最主流的数据交换方式。REST 接口本身就是基于 JSON 的，自然，C++ REST SDK 需要对 JSON 有很好的支持。</p><p>JSON 本身可以在网上找到很多介绍的文章，我这儿就不多讲了。有几个 C++ 相关的关键点需要提一下：</p><ul><li>JSON 的基本类型是空值类型、布尔类型、数字类型和字符串类型。其中空值类型和数字类型在 C++ 里是没有直接对应物的。数字类型在 C++ 里可能映射到 <code>double</code>，也可能是 <code>int32_t</code> 或 <code>int64_t</code>。</li><li>JSON 的复合类型是数组（array）和对象（object）。JSON 数组像 C++ 的 <code>vector</code>，但每个成员的类型可以是任意 JSON 类型，而不像 <code>vector</code> 通常是同质的——所有成员属于同一类型。JSON 对象像 C++ 的 <code>map</code>，键类型为 JSON 字符串，值类型则为任意 JSON 类型。JSON 标准不要求对象的各项之间有顺序，不过，从实际项目的角度，我个人觉得保持顺序还是非常有用的。</li></ul><p>如果你去搜索“c++ json”的话，还是可以找到一些不同的 JSON 实现的。功能最完整、名声最响的目前似乎是 nlohmann/json [6]，而腾讯释出的 RapidJSON [7] 则以性能闻名 [8]。需要注意一下各个实现之间的区别：</p><ul><li>nlohmann/json 不支持对 JSON 的对象（object）保持赋值顺序；RapidJSON 保持赋值顺序；C++ REST SDK 可选保持赋值顺序（通过 <code>web::json::keep_object_element_order</code> 和 <code>web::json::value::object</code> 的参数）。</li><li>nlohmann/json 支持最友好的初始化语法，可以使用初始化列表和 JSON 字面量；C++ REST SDK 只能逐项初始化，并且一般应显式调用 <code>web::json::value</code> 的构造函数（接受布尔类型和字符串类型的构造函数有 <code>explicit</code> 标注）；RapidJSON 介于中间，不支持初始化列表和字面量，但赋值可以直接进行。</li><li>nlohmann/json 和 C++ REST SDK 支持直接在用方括号 <code>[]</code> 访问不存在的 JSON 数组（array）成员时改变数组的大小；RapidJSON 的接口不支持这种用法，要向 JSON 数组里添加成员要麻烦得多。</li><li>作为性能的代价，RapidJSON 里在初始化字符串值时，只会传递指针值；用户需要保证字符串在 JSON 值使用过程中的有效性。要复制字符串的话，接口要麻烦得多。</li><li>RapidJSON 的 JSON 对象没有 <code>begin</code> 和 <code>end</code> 方法，因而无法使用标准的基于范围的 for 循环。总体而言，RapidJSON 的接口显得最特别、不通用。</li></ul><p>如果你使用 C++ REST SDK 的其他功能，你当然也没有什么选择；否则，你可以考虑一下其他的 JSON 实现。下面，我们就只讨论 C++ REST SDK 里的 JSON 了。</p><p>在 C++ REST SDK 里，核心的类型是 <code>web::json::value</code>，这就对应到我前面说的“任意 JSON 类型”了。还是拿例子说话（改编自 RapidJSON 的例子）：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;utility&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;assert.h&amp;gt;</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#include &amp;lt;fcntl.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;io.h&amp;gt;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#include &amp;lt;cpprest/json.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using namespace utility;</span></span>
<span class="line"><span>using namespace web;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#define tcout std::wcout</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>#define tcout std::cout</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>  _setmode(_fileno(stdout),</span></span>
<span class="line"><span>           _O_WTEXT);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 测试的 JSON 字符串</span></span>
<span class="line"><span>  string_t json_str = U(R&quot;(</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;s&quot;: &quot;你好，世界&quot;,</span></span>
<span class="line"><span>      &quot;t&quot;: true,</span></span>
<span class="line"><span>      &quot;f&quot;: false,</span></span>
<span class="line"><span>      &quot;n&quot;: null,</span></span>
<span class="line"><span>      &quot;i&quot;: 123,</span></span>
<span class="line"><span>      &quot;d&quot;: 3.1416,</span></span>
<span class="line"><span>      &quot;a&quot;: [1, 2, 3]</span></span>
<span class="line"><span>    })&quot;);</span></span>
<span class="line"><span>  tcout &amp;lt;&amp;lt; &quot;Original JSON:&quot;</span></span>
<span class="line"><span>        &amp;lt;&amp;lt; json_str &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 保持元素顺序并分析 JSON 字符串</span></span>
<span class="line"><span>  json::keep_object_element_order(</span></span>
<span class="line"><span>    true);</span></span>
<span class="line"><span>  auto document =</span></span>
<span class="line"><span>    json::value::parse(json_str);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 遍历对象成员并输出类型</span></span>
<span class="line"><span>  static const char* type_names[] =</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;Number&quot;, &quot;Boolean&quot;, &quot;String&quot;,</span></span>
<span class="line"><span>      &quot;Object&quot;, &quot;Array&quot;,   &quot;Null&quot;,</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  for (auto&amp;amp;&amp;amp; value :</span></span>
<span class="line"><span>       document.as_object()) {</span></span>
<span class="line"><span>    tcout &amp;lt;&amp;lt; &quot;Type of member &quot;</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; value.first &amp;lt;&amp;lt; &quot; is &quot;</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; type_names[value.second</span></span>
<span class="line"><span>                          .type()]</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document 是对象</span></span>
<span class="line"><span>  assert(document.is_object());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document[&quot;s&quot;] 是字符串</span></span>
<span class="line"><span>  assert(document.has_field(U(&quot;s&quot;)));</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;s&quot;)].is_string());</span></span>
<span class="line"><span>  tcout &amp;lt;&amp;lt; &quot;s = &quot;</span></span>
<span class="line"><span>        &amp;lt;&amp;lt; document[U(&quot;s&quot;)] &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document[&quot;t&quot;] 是字符串</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;t&quot;)].is_boolean());</span></span>
<span class="line"><span>  tcout</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; &quot;t = &quot;</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; (document[U(&quot;t&quot;)].as_bool()</span></span>
<span class="line"><span>          ? &quot;true&quot;</span></span>
<span class="line"><span>          : &quot;false&quot;)</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document[&quot;f&quot;] 是字符串</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;f&quot;)].is_boolean());</span></span>
<span class="line"><span>  tcout</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; &quot;f = &quot;</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; (document[U(&quot;f&quot;)].as_bool()</span></span>
<span class="line"><span>          ? &quot;true&quot;</span></span>
<span class="line"><span>          : &quot;false&quot;)</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document[&quot;f&quot;] 是空值</span></span>
<span class="line"><span>  tcout</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; &quot;n = &quot;</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; (document[U(&quot;n&quot;)].is_null()</span></span>
<span class="line"><span>          ? &quot;null&quot;</span></span>
<span class="line"><span>          : &quot;?&quot;)</span></span>
<span class="line"><span>    &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document[&quot;i&quot;] 是整数</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;i&quot;)].is_number());</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;i&quot;)].is_integer());</span></span>
<span class="line"><span>  tcout &amp;lt;&amp;lt; &quot;i = &quot;</span></span>
<span class="line"><span>        &amp;lt;&amp;lt; document[U(&quot;i&quot;)] &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 检查 document[&quot;d&quot;] 是浮点数</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;d&quot;)].is_number());</span></span>
<span class="line"><span>  assert(</span></span>
<span class="line"><span>    document[U(&quot;d&quot;)].is_double());</span></span>
<span class="line"><span>  tcout &amp;lt;&amp;lt; &quot;d = &quot;</span></span>
<span class="line"><span>        &amp;lt;&amp;lt; document[U(&quot;d&quot;)] &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    // 检查 document[&quot;a&quot;] 是数组</span></span>
<span class="line"><span>    auto&amp;amp; a = document[U(&quot;a&quot;)];</span></span>
<span class="line"><span>    assert(a.is_array());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 测试读取数组元素并转换成整数</span></span>
<span class="line"><span>    int y = a[0].as_integer();</span></span>
<span class="line"><span>    (void)y;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 遍历数组成员并输出</span></span>
<span class="line"><span>    tcout &amp;lt;&amp;lt; &quot;a = &quot;;</span></span>
<span class="line"><span>    for (auto&amp;amp;&amp;amp; value :</span></span>
<span class="line"><span>         a.as_array()) {</span></span>
<span class="line"><span>      tcout &amp;lt;&amp;lt; value &amp;lt;&amp;lt; &#39; &#39;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    tcout &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 修改 document[&quot;i&quot;] 为长整数</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    uint64_t bignum = 65000;</span></span>
<span class="line"><span>    bignum *= bignum;</span></span>
<span class="line"><span>    bignum *= bignum;</span></span>
<span class="line"><span>    document[U(&quot;i&quot;)] = bignum;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    assert(!document[U(&quot;i&quot;)]</span></span>
<span class="line"><span>              .as_number()</span></span>
<span class="line"><span>              .is_int32());</span></span>
<span class="line"><span>    assert(document[U(&quot;i&quot;)]</span></span>
<span class="line"><span>             .as_number()</span></span>
<span class="line"><span>             .to_uint64() ==</span></span>
<span class="line"><span>           bignum);</span></span>
<span class="line"><span>    tcout &amp;lt;&amp;lt; &quot;i is changed to &quot;</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; document[U(&quot;i&quot;)]</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 在数组里添加数值</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    auto&amp;amp; a = document[U(&quot;a&quot;)];</span></span>
<span class="line"><span>    a[3] = 4;</span></span>
<span class="line"><span>    a[4] = 5;</span></span>
<span class="line"><span>    tcout &amp;lt;&amp;lt; &quot;a is changed to &quot;</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; document[U(&quot;a&quot;)]</span></span>
<span class="line"><span>          &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 在 JSON 文档里添加布尔值：等号</span></span>
<span class="line"><span>  // 右侧 json::value 不能省</span></span>
<span class="line"><span>  document[U(&quot;b&quot;)] =</span></span>
<span class="line"><span>    json::value(true);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 构造新对象，保持多个值的顺序</span></span>
<span class="line"><span>  auto temp =</span></span>
<span class="line"><span>    json::value::object(true);</span></span>
<span class="line"><span>  // 在新对象里添加字符串：等号右侧</span></span>
<span class="line"><span>  // json::value 不能省</span></span>
<span class="line"><span>  temp[U(&quot;from&quot;)] =</span></span>
<span class="line"><span>    json::value(U(&quot;rapidjson&quot;));</span></span>
<span class="line"><span>  temp[U(&quot;changed for&quot;)] =</span></span>
<span class="line"><span>    json::value(U(&quot;geekbang&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 把对象赋到文档里；json::value</span></span>
<span class="line"><span>  // 内部使用 unique_ptr，因而使用</span></span>
<span class="line"><span>  // move 可以减少拷贝</span></span>
<span class="line"><span>  document[U(&quot;adapted&quot;)] =</span></span>
<span class="line"><span>    std::move(temp);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 完整输出目前的 JSON 对象</span></span>
<span class="line"><span>  tcout &amp;lt;&amp;lt; document &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>例子里我加了不少注释，应当可以帮助你看清 JSON 对象的基本用法了。唯一遗憾的是宏 <code>U</code>（类似于<a href="https://time.geekbang.org/column/article/179357" target="_blank" rel="noopener noreferrer">[第 11 讲]</a> 里提到过的 <code>_T</code>）的使用有点碍眼：要确保代码在 Windows 下和 Unix 下都能工作，目前这还是必要的。</p><p>建议你测试一下这个例子。查看一下结果。</p><p>C++ REST SDK 里的 <code>http_request</code> 和 <code>http_response</code> 都对 JSON 有原生支持，如可以使用 <code>extract_json</code> 成员函数来异步提取 HTTP 请求或响应体中的 JSON 内容。</p><h2 id="http-服务器" tabindex="-1"><a class="header-anchor" href="#http-服务器"><span>HTTP 服务器</span></a></h2><p>前面我们提到了如何使用 C++ REST SDK 来快速搭建一个 HTTP 客户端。同样，我们也可以使用 C++ REST SDK 来快速搭建一个 HTTP 服务器。在三种主流的操作系统上，C++ REST SDK 的 <code>http_listener</code> 会通过调用 Boost.Asio [9] 和操作系统的底层接口（IOCP、epoll 或 kqueue）来完成功能，向使用者隐藏这些细节、提供一个简单的编程接口。</p><p>我们将搭建一个最小的 REST 服务器，只能处理一个 sayHi 请求。客户端应当向服务器发送一个 HTTP 请求，URI 是：</p><blockquote></blockquote><p><code>/sayHi?name=…</code></p><p>“…”部分代表一个名字，而服务器应当返回一个 JSON 的回复，形如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>{&quot;msg&quot;: &quot;Hi, …!&quot;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这个服务器的有效代码行同样只有六十多行，如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;exception&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;iostream&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;map&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;string&amp;gt;</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#include &amp;lt;fcntl.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;io.h&amp;gt;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#include &amp;lt;cpprest/http_listener.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;lt;cpprest/json.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using namespace utility;</span></span>
<span class="line"><span>using namespace web;</span></span>
<span class="line"><span>using namespace web::http;</span></span>
<span class="line"><span>using namespace web::http::</span></span>
<span class="line"><span>  experimental::listener;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>#define tcout std::wcout</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>#define tcout std::cout</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void handle_get(http_request req)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  auto&amp;amp; uri = req.request_uri();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (uri.path() != U(&quot;/sayHi&quot;)) {</span></span>
<span class="line"><span>    req.reply(</span></span>
<span class="line"><span>      status_codes::NotFound);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  tcout &amp;lt;&amp;lt; uri::decode(uri.query())</span></span>
<span class="line"><span>        &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  auto query =</span></span>
<span class="line"><span>    uri::split_query(uri.query());</span></span>
<span class="line"><span>  auto it = query.find(U(&quot;name&quot;));</span></span>
<span class="line"><span>  if (it == query.end()) {</span></span>
<span class="line"><span>    req.reply(</span></span>
<span class="line"><span>      status_codes::BadRequest,</span></span>
<span class="line"><span>      U(&quot;Missing query info&quot;));</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  auto answer =</span></span>
<span class="line"><span>    json::value::object(true);</span></span>
<span class="line"><span>  answer[U(&quot;msg&quot;)] = json::value(</span></span>
<span class="line"><span>    string_t(U(&quot;Hi, &quot;)) +</span></span>
<span class="line"><span>    uri::decode(it-&amp;gt;second) +</span></span>
<span class="line"><span>    U(&quot;!&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  req.reply(status_codes::OK,</span></span>
<span class="line"><span>            answer);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>#ifdef _WIN32</span></span>
<span class="line"><span>  _setmode(_fileno(stdout),</span></span>
<span class="line"><span>           _O_WTEXT);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  http_listener listener(</span></span>
<span class="line"><span>    U(&quot;http://127.0.0.1:8008/&quot;));</span></span>
<span class="line"><span>  listener.support(methods::GET,</span></span>
<span class="line"><span>                   handle_get);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    listener.open().wait();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tcout &amp;lt;&amp;lt; &quot;Listening. Press &quot;</span></span>
<span class="line"><span>             &quot;ENTER to exit.\\n&quot;;</span></span>
<span class="line"><span>    string line;</span></span>
<span class="line"><span>    getline(cin, line);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    listener.close().wait();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  catch (const exception&amp;amp; e) {</span></span>
<span class="line"><span>    cerr &amp;lt;&amp;lt; e.what() &amp;lt;&amp;lt; endl;</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你熟悉 HTTP 协议的话，上面的代码应当是相当直白的。只有少数几个细节我需要说明一下：</p><ul><li>我们调用 <code>http_request::reply</code> 的第二个参数是 <code>json::value</code> 类型，这会让 HTTP 的内容类型（Content-Type）自动置成“application/json”。</li><li><code>http_request::request_uri</code> 函数返回的是 <code>uri</code> 的引用，因此我用 <code>auto&amp;amp;</code> 来接收。<code>uri::split_query</code> 函数返回的是一个普通的 <code>std::map</code>，因此我用 <code>auto</code> 来接收。</li><li><code>http_listener::open</code> 和 <code>http_listener::close</code> 返回的是 <code>pplx::task&amp;lt;void&amp;gt;</code>；当这个任务完成时（<code>wait</code> 调用返回），表示 HTTP 监听器上的对应操作（打开或关闭）真正完成了。</li></ul><p>运行程序，然后在另外一个终端里使用我们的第一个例子生成的可执行文件（或 curl）：</p><blockquote></blockquote><p><code>curl &quot;http://127.0.0.1:8008/sayHi?name=Peter&quot;</code></p><p>我们就应该会得到正确的结果：</p><blockquote></blockquote><p><code>{&quot;msg&quot;:&quot;Hi, Peter!&quot;}</code></p><p>你也可以尝试把路径和参数写错，查看一下程序对出错的处理。</p><h2 id="关于线程的细节" tabindex="-1"><a class="header-anchor" href="#关于线程的细节"><span>关于线程的细节</span></a></h2><p>C++ REST SDK 使用异步的编程模式，使得写不阻塞的代码变得相当容易。不过，底层它是使用一个线程池来实现的——在 C++20 的协程能被使用之前，并没有什么更理想的跨平台方式可用。</p><p>C++ REST SDK 缺省会开启 40 个线程。在目前的实现里，如果这些线程全部被用完了，会导致系统整体阻塞。反过来，如果你只是用 C++ REST SDK 的 HTTP 客户端，你就不需要这么多线程。这个线程数量目前在代码里是可以控制的。比如，下面的代码会把线程池的大小设为 10：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;pplx/threadpool.h&amp;gt;</span></span>
<span class="line"><span>…</span></span>
<span class="line"><span>crossplat::threadpool::</span></span>
<span class="line"><span>  initialize_with_threads(10);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你使用 C++ REST SDK 开发一个服务器，则不仅应当增加线程池的大小，还应当对并发数量进行统计，在并发数接近线程数时主动拒绝新的连接——一般可返回 <code>status_codes::ServiceUnavailable</code>——以免造成整个系统的阻塞。</p><h2 id="内容小结" tabindex="-1"><a class="header-anchor" href="#内容小结"><span>内容小结</span></a></h2><p>今天我们对 C++ REST SDK 的主要功能作了一下概要的讲解和演示，让你了解了它的主要功能和这种异步的编程方式。还有很多功能没有讲，但你应该可以通过查文档了解如何使用了。</p><p>这只能算是我们旅程中的一站——因为随着 C++20 的到来，我相信一定会有更多好用的网络开发库出现的。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考"><span>课后思考</span></a></h2><p>作为实战篇的最后一讲，内容还是略有点复杂的。如果你一下子消化不了，可以复习前面的相关内容。</p><p>如果对这讲的内容本身没有问题，则可以考虑一下，你觉得 C++ REST SDK 的接口好用吗？如果好用，原因是什么？如果不好用，你有什么样的改进意见？</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料"><span>参考资料</span></a></h2><p>[1] Microsoft, cpprestsdk. <a href="https://github.com/microsoft/cpprestsdk" target="_blank" rel="noopener noreferrer">https://github.com/microsoft/cpprestsdk</a></p><p>[2] Wikipedia, “Hypertext Transfer Protocol”. <a href="https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol" target="_blank" rel="noopener noreferrer">https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol</a></p><p>[2a] 维基百科, “超文本传输协议”. <a href="https://zh.m.wikipedia.org/zh-hans/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE" target="_blank" rel="noopener noreferrer">https://zh.m.wikipedia.org/zh-hans/超文本传输协议</a></p><p>[3] RESTful. <a href="https://restfulapi.net/" target="_blank" rel="noopener noreferrer">https://restfulapi.net/</a></p><p>[4] curl. <a href="https://curl.haxx.se/" target="_blank" rel="noopener noreferrer">https://curl.haxx.se/</a></p><p>[5] JSON. <a href="https://www.json.org/" target="_blank" rel="noopener noreferrer">https://www.json.org/</a></p><p>[6] Niels Lohmann, json. <a href="https://github.com/nlohmann/json" target="_blank" rel="noopener noreferrer">https://github.com/nlohmann/json</a></p><p>[7] Tencent, rapidjson. <a href="https://github.com/Tencent/rapidjson" target="_blank" rel="noopener noreferrer">https://github.com/Tencent/rapidjson</a></p><p>[8] Milo Yip, nativejson-benchmark. <a href="https://github.com/miloyip/nativejson-benchmark" target="_blank" rel="noopener noreferrer">https://github.com/miloyip/nativejson-benchmark</a></p><p>[9] Christopher Kohlhoff, Boost.Asio. <a href="https://www.boost.org/doc/libs/release/doc/html/boost_asio.html" target="_blank" rel="noopener noreferrer">https://www.boost.org/doc/libs/release/doc/html/boost_asio.html</a></p>`,87)]))}const r=n(p,[["render",l]]),u=JSON.parse('{"path":"/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%AE%9E%E6%88%98%E7%AF%87/27%20_%20C__%20REST%20SDK%EF%BC%9A%E4%BD%BF%E7%94%A8%E7%8E%B0%E4%BB%A3C__%E5%BC%80%E5%8F%91%E7%BD%91%E7%BB%9C%E5%BA%94%E7%94%A8.html","title":"27 _ C++ REST SDK：使用现代C++开发网络应用","lang":"zh-CN","frontmatter":{"description":"27 _ C++ REST SDK：使用现代C++开发网络应用 你好，我是吴咏炜。 在实战篇，我们最后要讲解的一个库是 C++ REST SDK（也写作 cpprestsdk）[1]，一个支持 HTTP 协议 [2]、主要用于 RESTful [3] 接口开发的 C++ 库。 初识 C++ REST SDK 向你提一个问题，你认为用多少行代码可以写出一...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%8E%B0%E4%BB%A3C__%E5%AE%9E%E6%88%9830%E8%AE%B2/%E5%AE%9E%E6%88%98%E7%AF%87/27%20_%20C__%20REST%20SDK%EF%BC%9A%E4%BD%BF%E7%94%A8%E7%8E%B0%E4%BB%A3C__%E5%BC%80%E5%8F%91%E7%BD%91%E7%BB%9C%E5%BA%94%E7%94%A8.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"27 _ C++ REST SDK：使用现代C++开发网络应用"}],["meta",{"property":"og:description","content":"27 _ C++ REST SDK：使用现代C++开发网络应用 你好，我是吴咏炜。 在实战篇，我们最后要讲解的一个库是 C++ REST SDK（也写作 cpprestsdk）[1]，一个支持 HTTP 协议 [2]、主要用于 RESTful [3] 接口开发的 C++ 库。 初识 C++ REST SDK 向你提一个问题，你认为用多少行代码可以写出一..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"27 _ C++ REST SDK：使用现代C++开发网络应用\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":16.6,"words":4979},"filePathRelative":"posts/现代C++实战30讲/实战篇/27 _ C++ REST SDK：使用现代C++开发网络应用.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"27 | C++ REST SDK：使用现代C++开发网络应用\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/44/78/44d5594c569500dc14cd9b55554a8078.mp3\\"></audio></p>\\n<p>你好，我是吴咏炜。</p>\\n<p>在实战篇，我们最后要讲解的一个库是 C++ REST SDK（也写作 cpprestsdk）[1]，一个支持 HTTP 协议 [2]、主要用于 RESTful [3] 接口开发的 C++ 库。</p>","autoDesc":true}');export{r as comp,u as data};
