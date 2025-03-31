import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(t,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="24 | HTTP网络编程与JSON解析" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/b8/a1/b840f321655f1d0c3eb1b6ef06e7eca1.mp3"></audio></p><p>你好，我是陈航。</p><p>在上一篇文章中，我带你一起学习了Dart中异步与并发的机制及实现原理。与其他语言类似，Dart的异步是通过事件循环与队列实现的，我们可以使用Future来封装异步任务。而另一方面，尽管Dart是基于单线程模型的，但也提供了Isolate这样的“多线程”能力，这使得我们可以充分利用系统资源，在并发Isolate中搞定CPU密集型的任务，并通过消息机制通知主Isolate运行结果。</p><p>异步与并发的一个典型应用场景，就是网络编程。一个好的移动应用，不仅需要有良好的界面和易用的交互体验，也需要具备和外界进行信息交互的能力。而通过网络，信息隔离的客户端与服务端间可以建立一个双向的通信通道，从而实现资源访问、接口数据请求和提交、上传下载文件等操作。</p><p>为了便于我们快速实现基于网络通道的信息交换实时更新App数据，Flutter也提供了一系列的网络编程类库和工具。因此在今天的分享中，我会通过一些小例子与你讲述在Flutter应用中，如何实现与服务端的数据交互，以及如何将交互响应的数据格式化。</p><h2 id="http网络编程" tabindex="-1"><a class="header-anchor" href="#http网络编程"><span>Http网络编程</span></a></h2><p>我们在通过网络与服务端数据交互时，不可避免地需要用到三个概念：定位、传输与应用。</p><p>其中，<strong>定位</strong>，定义了如何准确地找到网络上的一台或者多台主机（即IP地址）；<strong>传输</strong>，则主要负责在找到主机后如何高效且可靠地进行数据通信（即TCP、UDP协议）；而<strong>应用</strong>，则负责识别双方通信的内容（即HTTP协议）。</p><p>我们在进行数据通信时，可以只使用传输层协议。但传输层传递的数据是二进制流，如果没有应用层，我们无法识别数据内容。如果想要使传输的数据有意义，则必须要用到应用层协议。移动应用通常使用HTTP协议作应用层协议，来封装HTTP信息。</p><p>在编程框架中，一次HTTP网络调用通常可以拆解为以下步骤：</p><ol><li>创建网络调用实例client，设置通用请求行为（如超时时间）；</li><li>构造URI，设置请求header、body；</li><li>发起请求, 等待响应；</li><li>解码响应的内容。</li></ol><p>当然，Flutter也不例外。在Flutter中，Http网络编程的实现方式主要分为三种：dart:io里的HttpClient实现、Dart原生http请求库实现、第三方库dio实现。接下来，我依次为你讲解这三种方式。</p><h3 id="httpclient" tabindex="-1"><a class="header-anchor" href="#httpclient"><span>HttpClient</span></a></h3><p>HttpClient是dart:io库中提供的网络请求类，实现了基本的网络编程功能。</p><p>接下来，我将和你分享一个实例，对照着上面提到的网络调用步骤，来演示HttpClient如何使用。</p><p>在下面的代码中，我们创建了一个HttpClien网络调用实例，设置了其超时时间为5秒。随后构造了Flutter官网的URI，并设置了请求Header的user-agent为Custom-UA。然后发起请求，等待Flutter官网响应。最后在收到响应后，打印出返回结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>get() async {</span></span>
<span class="line"><span>  //创建网络调用示例，设置通用请求行为(超时时间)</span></span>
<span class="line"><span>  var httpClient = HttpClient();</span></span>
<span class="line"><span>  httpClient.idleTimeout = Duration(seconds: 5);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  //构造URI，设置user-agent为&amp;quot;Custom-UA&amp;quot;</span></span>
<span class="line"><span>  var uri = Uri.parse(&amp;quot;https://flutter.dev&amp;quot;);</span></span>
<span class="line"><span>  var request = await httpClient.getUrl(uri);</span></span>
<span class="line"><span>  request.headers.add(&amp;quot;user-agent&amp;quot;, &amp;quot;Custom-UA&amp;quot;);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  //发起请求，等待响应</span></span>
<span class="line"><span>  var response = await request.close();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  //收到响应，打印结果</span></span>
<span class="line"><span>  if (response.statusCode == HttpStatus.ok) {</span></span>
<span class="line"><span>    print(await response.transform(utf8.decoder).join());</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    print(&#39;Error: \\nHttp status \${response.statusCode}&#39;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，使用HttpClient来发起网络调用还是相对比较简单的。</p><p>这里需要注意的是，由于网络请求是异步行为，因此<strong>在Flutter中，所有网络编程框架都是以Future作为异步请求的包装</strong>，所以我们需要使用await与async进行非阻塞的等待。当然，你也可以注册then，以回调的方式进行相应的事件处理。</p><h3 id="http" tabindex="-1"><a class="header-anchor" href="#http"><span>http</span></a></h3><p>HttpClient使用方式虽然简单，但其接口却暴露了不少内部实现细节。比如，异步调用拆分得过细，链接需要调用方主动关闭，请求结果是字符串但却需要手动解码等。</p><p>http是Dart官方提供的另一个网络请求类，相比于HttpClient，易用性提升了不少。同样，我们以一个例子来介绍http的使用方法。</p><p>首先，我们需要将http加入到pubspec中的依赖里：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>dependencies:</span></span>
<span class="line"><span>  http: &#39;&amp;gt;=0.11.3+12&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>在下面的代码中，与HttpClient的例子类似的，我们也是先后构造了http网络调用实例和Flutter官网URI，在设置user-agent为Custom-UA后，发出请求，最后打印请求结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>httpGet() async {</span></span>
<span class="line"><span>  //创建网络调用示例</span></span>
<span class="line"><span>  var client = http.Client();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //构造URI</span></span>
<span class="line"><span>  var uri = Uri.parse(&amp;quot;https://flutter.dev&amp;quot;);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  //设置user-agent为&amp;quot;Custom-UA&amp;quot;，随后立即发出请求</span></span>
<span class="line"><span>  http.Response response = await client.get(uri, headers : {&amp;quot;user-agent&amp;quot; : &amp;quot;Custom-UA&amp;quot;});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //打印请求结果</span></span>
<span class="line"><span>  if(response.statusCode == HttpStatus.ok) {</span></span>
<span class="line"><span>    print(response.body);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    print(&amp;quot;Error: \${response.statusCode}&amp;quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，相比于HttpClient，http的使用方式更加简单，仅需一次异步调用就可以实现基本的网络通信。</p><h3 id="dio" tabindex="-1"><a class="header-anchor" href="#dio"><span>dio</span></a></h3><p>HttpClient和http使用方式虽然简单，但其暴露的定制化能力都相对较弱，很多常用的功能都不支持（或者实现异常繁琐），比如取消请求、定制拦截器、Cookie管理等。因此对于复杂的网络请求行为，我推荐使用目前在Dart社区人气较高的第三方dio来发起网络请求。</p><p>接下来，我通过几个例子来和你介绍dio的使用方法。与http类似的，我们首先需要把dio加到pubspec中的依赖里：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>dependencies:</span></span>
<span class="line"><span>  dio: &#39;&amp;gt;2.1.3&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>在下面的代码中，与前面HttpClient与http例子类似的，我们也是先后创建了dio网络调用实例、创建URI、设置Header、发出请求，最后等待请求结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>void getRequest() async {</span></span>
<span class="line"><span>  //创建网络调用示例</span></span>
<span class="line"><span>  Dio dio = new Dio();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  //设置URI及请求user-agent后发起请求</span></span>
<span class="line"><span>  var response = await dio.get(&amp;quot;https://flutter.dev&amp;quot;, options:Options(headers: {&amp;quot;user-agent&amp;quot; : &amp;quot;Custom-UA&amp;quot;}));</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span> //打印请求结果</span></span>
<span class="line"><span>  if(response.statusCode == HttpStatus.ok) {</span></span>
<span class="line"><span>    print(response.data.toString());</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    print(&amp;quot;Error: \${response.statusCode}&amp;quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote></blockquote><p>这里需要注意的是，创建URI、设置Header及发出请求的行为，都是通过dio.get方法实现的。这个方法的options参数提供了精细化控制网络请求的能力，可以支持设置Header、超时时间、Cookie、请求方法等。这部分内容不是今天分享的重点，如果你想深入理解的话，可以访问其<a href="https://github.com/flutterchina/dio#dio-apis" target="_blank" rel="noopener noreferrer">API文档</a>学习具体使用方法。</p><p>对于常见的上传及下载文件需求，dio也提供了良好的支持：文件上传可以通过构建表单FormData实现，而文件下载则可以使用download方法搞定。</p><p>在下面的代码中，我们通过FormData创建了两个待上传的文件，通过post方法发送至服务端。download的使用方法则更为简单，我们直接在请求参数中，把待下载的文件地址和本地文件名提供给dio即可。如果我们需要感知下载进度，可以增加onReceiveProgress回调函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//使用FormData表单构建待上传文件</span></span>
<span class="line"><span>FormData formData = FormData.from({</span></span>
<span class="line"><span>  &amp;quot;file1&amp;quot;: UploadFileInfo(File(&amp;quot;./file1.txt&amp;quot;), &amp;quot;file1.txt&amp;quot;),</span></span>
<span class="line"><span>  &amp;quot;file2&amp;quot;: UploadFileInfo(File(&amp;quot;./file2.txt&amp;quot;), &amp;quot;file1.txt&amp;quot;),</span></span>
<span class="line"><span></span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>//通过post方法发送至服务端</span></span>
<span class="line"><span>var responseY = await dio.post(&amp;quot;https://xxx.com/upload&amp;quot;, data: formData);</span></span>
<span class="line"><span>print(responseY.toString());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//使用download方法下载文件</span></span>
<span class="line"><span>dio.download(&amp;quot;https://xxx.com/file1&amp;quot;, &amp;quot;xx1.zip&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//增加下载进度回调函数</span></span>
<span class="line"><span>dio.download(&amp;quot;https://xxx.com/file1&amp;quot;, &amp;quot;xx2.zip&amp;quot;, onReceiveProgress: (count, total) {</span></span>
<span class="line"><span>	//do something      </span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有时，我们的页面由多个并行的请求响应结果构成，这就需要等待这些请求都返回后才能刷新界面。在dio中，我们可以结合Future.wait方法轻松实现：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//同时发起两个并行请求</span></span>
<span class="line"><span>List&amp;lt;Response&amp;gt; responseX= await Future.wait([dio.get(&amp;quot;https://flutter.dev&amp;quot;),dio.get(&amp;quot;https://pub.dev/packages/dio&amp;quot;)]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//打印请求1响应结果</span></span>
<span class="line"><span>print(&amp;quot;Response1: \${responseX[0].toString()}&amp;quot;);</span></span>
<span class="line"><span>//打印请求2响应结果</span></span>
<span class="line"><span>print(&amp;quot;Response2: \${responseX[1].toString()}&amp;quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此外，与Android的okHttp一样，dio还提供了请求拦截器，通过拦截器，我们可以在请求之前，或响应之后做一些特殊的操作。比如可以为请求option统一增加一个header，或是返回缓存数据，或是增加本地校验处理等等。</p><p>在下面的例子中，我们为dio增加了一个拦截器。在请求发送之前，不仅为每个请求头都加上了自定义的user-agent，还实现了基本的token认证信息检查功能。而对于本地已经缓存了请求uri资源的场景，我们可以直接返回缓存数据，避免再次下载：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//增加拦截器</span></span>
<span class="line"><span>dio.interceptors.add(InterceptorsWrapper(</span></span>
<span class="line"><span>    onRequest: (RequestOptions options){</span></span>
<span class="line"><span>      //为每个请求头都增加user-agent</span></span>
<span class="line"><span>      options.headers[&amp;quot;user-agent&amp;quot;] = &amp;quot;Custom-UA&amp;quot;;</span></span>
<span class="line"><span>      //检查是否有token，没有则直接报错</span></span>
<span class="line"><span>      if(options.headers[&#39;token&#39;] == null) {</span></span>
<span class="line"><span>        return dio.reject(&amp;quot;Error:请先登录&amp;quot;);</span></span>
<span class="line"><span>      } </span></span>
<span class="line"><span>      //检查缓存是否有数据</span></span>
<span class="line"><span>      if(options.uri == Uri.parse(&#39;http://xxx.com/file1&#39;)) {</span></span>
<span class="line"><span>        return dio.resolve(&amp;quot;返回缓存数据&amp;quot;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      //放行请求</span></span>
<span class="line"><span>      return options;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//增加try catch，防止请求报错</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  var response = await dio.get(&amp;quot;https://xxx.com/xxx.zip&amp;quot;);</span></span>
<span class="line"><span>  print(response.data.toString());</span></span>
<span class="line"><span>}catch(e) {</span></span>
<span class="line"><span>  print(e);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，由于网络通信期间有可能会出现异常（比如，域名无法解析、超时等），因此我们需要使用try-catch来捕获这些未知错误，防止程序出现异常。</p><p>除了这些基本的用法，dio还支持请求取消、设置代理，证书校验等功能。不过，这些高级特性不属于本次分享的重点，故不再赘述，详情可以参考dio的<a href="https://github.com/flutterchina/dio/blob/master/README-ZH.md" target="_blank" rel="noopener noreferrer">GitHub主页</a>了解具体用法。</p><h2 id="json解析" tabindex="-1"><a class="header-anchor" href="#json解析"><span>JSON解析</span></a></h2><p>移动应用与Web服务器建立好了连接之后，接下来的两个重要工作分别是：服务器如何结构化地去描述返回的通信信息，以及移动应用如何解析这些格式化的信息。</p><h3 id="如何结构化地描述返回的通信信息" tabindex="-1"><a class="header-anchor" href="#如何结构化地描述返回的通信信息"><span>如何结构化地描述返回的通信信息？</span></a></h3><p>在如何结构化地去表达信息上，我们需要用到JSON。JSON是一种轻量级的、用于表达由属性值和字面量组成对象的数据交换语言。</p><p>一个简单的表示学生成绩的JSON结构，如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>String jsonString = &#39;&#39;&#39;</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &amp;quot;id&amp;quot;:&amp;quot;123&amp;quot;,</span></span>
<span class="line"><span>  &amp;quot;name&amp;quot;:&amp;quot;张三&amp;quot;,</span></span>
<span class="line"><span>  &amp;quot;score&amp;quot; : 95</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&#39;&#39;&#39;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，由于Flutter不支持运行时反射，因此并没有提供像Gson、Mantle这样自动解析JSON的库来降低解析成本。在Flutter中，JSON解析完全是手动的，开发者要做的事情多了一些，但使用起来倒也相对灵活。</p><p>接下来，我们就看看Flutter应用是如何解析这些格式化的信息。</p><h3 id="如何解析格式化的信息" tabindex="-1"><a class="header-anchor" href="#如何解析格式化的信息"><span>如何解析格式化的信息？</span></a></h3><p>所谓手动解析，是指使用dart:convert库中内置的JSON解码器，将JSON字符串解析成自定义对象的过程。使用这种方式，我们需要先将JSON字符串传递给JSON.decode方法解析成一个Map，然后把这个Map传给自定义的类，进行相关属性的赋值。</p><p>以上面表示学生成绩的JSON结构为例，我来和你演示手动解析的使用方法。</p><p>首先，我们根据JSON结构定义Student类，并创建一个工厂类，来处理Student类属性成员与JSON字典对象的值之间的映射关系：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Student{</span></span>
<span class="line"><span>  //属性id，名字与成绩</span></span>
<span class="line"><span>  String id;</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  int score;</span></span>
<span class="line"><span>  //构造方法  </span></span>
<span class="line"><span>  Student({</span></span>
<span class="line"><span>    this.id,</span></span>
<span class="line"><span>    this.name,</span></span>
<span class="line"><span>    this.score</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  //JSON解析工厂类，使用字典数据为对象初始化赋值</span></span>
<span class="line"><span>  factory Student.fromJson(Map&amp;lt;String, dynamic&amp;gt; parsedJson){</span></span>
<span class="line"><span>    return Student(</span></span>
<span class="line"><span>        id: parsedJson[&#39;id&#39;],</span></span>
<span class="line"><span>        name : parsedJson[&#39;name&#39;],</span></span>
<span class="line"><span>        score : parsedJson [&#39;score&#39;]</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>数据解析类创建好了，剩下的事情就相对简单了，我们只需要把JSON文本通过JSON.decode方法转换成Map，然后把它交给Student的工厂类fromJson方法，即可完成Student对象的解析：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>loadStudent() {</span></span>
<span class="line"><span>  //jsonString为JSON文本</span></span>
<span class="line"><span>  final jsonResponse = json.decode(jsonString);</span></span>
<span class="line"><span>  Student student = Student.fromJson(jsonResponse);</span></span>
<span class="line"><span>  print(student.name);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的例子中，JSON文本所有的属性都是基本类型，因此我们直接从JSON字典取出相应的元素为对象赋值即可。而如果JSON下面还有嵌套对象属性，比如下面的例子中，Student还有一个teacher的属性，我们又该如何解析呢？</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>String jsonString = &#39;&#39;&#39;</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &amp;quot;id&amp;quot;:&amp;quot;123&amp;quot;,</span></span>
<span class="line"><span>  &amp;quot;name&amp;quot;:&amp;quot;张三&amp;quot;,</span></span>
<span class="line"><span>  &amp;quot;score&amp;quot; : 95,</span></span>
<span class="line"><span>  &amp;quot;teacher&amp;quot;: {</span></span>
<span class="line"><span>    &amp;quot;name&amp;quot;: &amp;quot;李四&amp;quot;,</span></span>
<span class="line"><span>    &amp;quot;age&amp;quot; : 40</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&#39;&#39;&#39;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里，teacher不再是一个基本类型，而是一个对象。面对这种情况，我们需要为每一个非基本类型属性创建一个解析类。与Student类似，我们也需要为它的属性teacher创建一个解析类Teacher：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Teacher {</span></span>
<span class="line"><span>  //Teacher的名字与年龄</span></span>
<span class="line"><span>  String name;</span></span>
<span class="line"><span>  int age;</span></span>
<span class="line"><span>  //构造方法</span></span>
<span class="line"><span>  Teacher({this.name,this.age});</span></span>
<span class="line"><span>  //JSON解析工厂类，使用字典数据为对象初始化赋值</span></span>
<span class="line"><span>  factory Teacher.fromJson(Map&amp;lt;String, dynamic&amp;gt; parsedJson){</span></span>
<span class="line"><span>    return Teacher(</span></span>
<span class="line"><span>        name : parsedJson[&#39;name&#39;],</span></span>
<span class="line"><span>        age : parsedJson [&#39;age&#39;]</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们只需要在Student类中，增加teacher属性及对应的JSON映射规则即可：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>class Student{</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  //增加teacher属性</span></span>
<span class="line"><span>  Teacher teacher;</span></span>
<span class="line"><span>  //构造函数增加teacher</span></span>
<span class="line"><span>  Student({</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    this.teacher</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  factory Student.fromJson(Map&amp;lt;String, dynamic&amp;gt; parsedJson){</span></span>
<span class="line"><span>    return Student(</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        //增加映射规则</span></span>
<span class="line"><span>        teacher: Teacher.fromJson(parsedJson [&#39;teacher&#39;])</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成了teacher属性的映射规则添加之后，我们就可以继续使用Student来解析上述的JSON文本了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>final jsonResponse = json.decode(jsonString);//将字符串解码成Map对象</span></span>
<span class="line"><span>Student student = Student.fromJson(jsonResponse);//手动解析</span></span>
<span class="line"><span>print(student.teacher.name);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，通过这种方法，无论对象有多复杂的非基本类型属性，我们都可以创建对应的解析类进行处理。</p><p>不过到现在为止，我们的JSON数据解析还是在主Isolate中完成。如果JSON的数据格式比较复杂，数据量又大，这种解析方式可能会造成短期UI无法响应。对于这类CPU密集型的操作，我们可以使用上一篇文章中提到的compute函数，将解析工作放到新的Isolate中完成：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>static Student parseStudent(String content) {</span></span>
<span class="line"><span>  final jsonResponse = json.decode(content);</span></span>
<span class="line"><span>  Student student = Student.fromJson(jsonResponse);</span></span>
<span class="line"><span>  return student;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>doSth() {</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> //用compute函数将json解析放到新Isolate</span></span>
<span class="line"><span> compute(parseStudent,jsonString).then((student)=&amp;gt;print(student.teacher.name));</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过compute的改造，我们就不用担心JSON解析时间过长阻塞UI响应了。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>好了，今天的分享就到这里了，我们简单回顾一下主要内容。</p><p>首先，我带你学习了实现Flutter应用与服务端通信的三种方式，即HttpClient、http与dio。其中dio提供的功能更为强大，可以支持请求拦截、文件上传下载、请求合并等高级能力。因此，我推荐你在实际项目中使用dio的方式。</p><p>然后，我和你分享了JSON解析的相关内容。JSON解析在Flutter中相对比较简单，但由于不支持反射，所以我们只能手动解析，即：先将JSON字符串转换成Map，然后再把这个Map给到自定义类，进行相关属性的赋值。</p><p>如果你有原生Android、iOS开发经验的话，可能会觉得Flutter提供的JSON手动解析方案并不好用。在Flutter中，没有像原生开发那样提供了Gson或Mantle等库，用于将JSON字符串直接转换为对应的实体类。而这些能力无一例外都需要用到运行时反射，这是Flutter从设计之初就不支持的，理由如下：</p><ol><li>运行时反射破坏了类的封装性和安全性，会带来安全风险。就在前段时间，Fastjson框架就爆出了一个巨大的安全漏洞。这个漏洞使得精心构造的字符串文本，可以在反序列化时让服务器执行任意代码，直接导致业务机器被远程控制、内网渗透、窃取敏感信息等操作。</li><li>运行时反射会增加二进制文件大小。因为搞不清楚哪些代码可能会在运行时用到，因此使用反射后，会默认使用所有代码构建应用程序，这就导致编译器无法优化编译期间未使用的代码，应用安装包体积无法进一步压缩，这对于自带Dart虚拟机的Flutter应用程序是难以接受的。</li></ol><p>反射给开发者编程带来了方便，但也带来了很多难以解决的新问题，因此Flutter并不支持反射。而我们要做的就是，老老实实地手动解析JSON吧。</p><p>我把今天分享所涉及到的知识点打包到了<a href="https://github.com/cyndibaby905/24_network_demo" target="_blank" rel="noopener noreferrer">GitHub</a>中，你可以下载下来，反复运行几次，加深理解与记忆。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>最后，我给你留两道思考题吧。</p><ol><li>请使用dio实现一个自定义拦截器，拦截器内检查header中的token：如果没有token，需要暂停本次请求，同时访问&quot;<a href="http://xxxx.com/token" target="_blank" rel="noopener noreferrer">http://xxxx.com/token</a>&quot;，在获取新token后继续本次请求。</li><li>为以下Student JSON写相应的解析类：</li></ol><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>String jsonString = &#39;&#39;&#39;</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    &amp;quot;id&amp;quot;:&amp;quot;123&amp;quot;,</span></span>
<span class="line"><span>    &amp;quot;name&amp;quot;:&amp;quot;张三&amp;quot;,</span></span>
<span class="line"><span>    &amp;quot;score&amp;quot; : 95,</span></span>
<span class="line"><span>    &amp;quot;teachers&amp;quot;: [</span></span>
<span class="line"><span>       {</span></span>
<span class="line"><span>         &amp;quot;name&amp;quot;: &amp;quot;李四&amp;quot;,</span></span>
<span class="line"><span>         &amp;quot;age&amp;quot; : 40</span></span>
<span class="line"><span>       },</span></span>
<span class="line"><span>       {</span></span>
<span class="line"><span>         &amp;quot;name&amp;quot;: &amp;quot;王五&amp;quot;,</span></span>
<span class="line"><span>         &amp;quot;age&amp;quot; : 45</span></span>
<span class="line"><span>       }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  &#39;&#39;&#39;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>欢迎你在评论区给我留言分享你的观点，我会在下一篇文章中等待你！感谢你的收听，也欢迎你把这篇文章分享给更多的朋友一起阅读。</p>`,85)]))}const c=n(p,[["render",l]]),o=JSON.parse('{"path":"/posts/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/Flutter%E8%BF%9B%E9%98%B6/24%20_%20HTTP%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E4%B8%8EJSON%E8%A7%A3%E6%9E%90.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是陈航。 在上一篇文章中，我带你一起学习了Dart中异步与并发的机制及实现原理。与其他语言类似，Dart的异步是通过事件循环与队列实现的，我们可以使用Future来封装异步任务。而另一方面，尽管Dart是基于单线程模型的，但也提供了Isolate这样的“多线程”能力，这使得我们可以充分利用系统资源，在并发Isolate中搞定CPU密集型的任务，...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Flutter%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/Flutter%E8%BF%9B%E9%98%B6/24%20_%20HTTP%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E4%B8%8EJSON%E8%A7%A3%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是陈航。 在上一篇文章中，我带你一起学习了Dart中异步与并发的机制及实现原理。与其他语言类似，Dart的异步是通过事件循环与队列实现的，我们可以使用Future来封装异步任务。而另一方面，尽管Dart是基于单线程模型的，但也提供了Isolate这样的“多线程”能力，这使得我们可以充分利用系统资源，在并发Isolate中搞定CPU密集型的任务，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":15.21,"words":4564},"filePathRelative":"posts/Flutter核心技术与实战/Flutter进阶/24 _ HTTP网络编程与JSON解析.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"24 | HTTP网络编程与JSON解析\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/b8/a1/b840f321655f1d0c3eb1b6ef06e7eca1.mp3\\"></audio></p>\\n<p>你好，我是陈航。</p>\\n<p>在上一篇文章中，我带你一起学习了Dart中异步与并发的机制及实现原理。与其他语言类似，Dart的异步是通过事件循环与队列实现的，我们可以使用Future来封装异步任务。而另一方面，尽管Dart是基于单线程模型的，但也提供了Isolate这样的“多线程”能力，这使得我们可以充分利用系统资源，在并发Isolate中搞定CPU密集型的任务，并通过消息机制通知主Isolate运行结果。</p>","autoDesc":true}');export{c as comp,o as data};
