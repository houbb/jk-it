import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(c,n){return i(),a("div",null,n[0]||(n[0]=[e(`<p><audio id="audio" title="27 | I/O多路复用遇上线程：使用poll单线程处理所有I/O事件" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/45/01/4576a09c92b2d1d90e1b6373db513001.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第27讲，欢迎回来。</p><p>我在前面两讲里，分别使用了fork进程和pthread线程来处理多并发，这两种技术使用简单，但是性能却会随着并发数的上涨而快速下降，并不能满足极端高并发的需求。就像第24讲中讲到的一样，这个时候我们需要寻找更好的解决之道，这个解决之道基本的思想就是I/O事件分发。</p><p>关于代码，你可以去<a href="https://github.com/froghui/yolanda" target="_blank" rel="noopener noreferrer">GitHub</a>上查看或下载完整代码。</p><h2 id="重温事件驱动" tabindex="-1"><a class="header-anchor" href="#重温事件驱动"><span>重温事件驱动</span></a></h2><h3 id="基于事件的程序设计-gui、web" tabindex="-1"><a class="header-anchor" href="#基于事件的程序设计-gui、web"><span>基于事件的程序设计: GUI、Web</span></a></h3><p>事件驱动的好处是占用资源少，效率高，可扩展性强，是支持高性能高并发的不二之选。</p><p>如果你熟悉GUI编程的话，你就会知道，GUI设定了一系列的控件，如Button、Label、文本框等，当我们设计基于控件的程序时，一般都会给Button的点击安排一个函数，类似这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//按钮点击的事件处理</span></span>
<span class="line"><span>void onButtonClick(){</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个设计的思想是，一个无限循环的事件分发线程在后台运行，一旦用户在界面上产生了某种操作，例如点击了某个Button，或者点击了某个文本框，一个事件会被产生并放置到事件队列中，这个事件会有一个类似前面的onButtonClick回调函数。事件分发线程的任务，就是为每个发生的事件找到对应的事件回调函数并执行它。这样，一个基于事件驱动的GUI程序就可以完美地工作了。</p><p>还有一个类似的例子是Web编程领域。同样的，Web程序会在Web界面上放置各种界面元素，例如Label、文本框、按钮等，和GUI程序类似，给感兴趣的界面元素设计JavaScript回调函数，当用户操作时，对应的JavaScript回调函数会被执行，完成某个计算或操作。这样，一个基于事件驱动的Web程序就可以在浏览器中完美地工作了。</p><p>在第24讲中，我们已经提到，通过使用poll、epoll等I/O分发技术，可以设计出基于套接字的事件驱动程序，从而满足高性能、高并发的需求。</p><p>事件驱动模型，也被叫做反应堆模型（reactor），或者是Event loop模型。这个模型的核心有两点。</p><p>第一，它存在一个无限循环的事件分发线程，或者叫做reactor线程、Event loop线程。这个事件分发线程的背后，就是poll、epoll等I/O分发技术的使用。</p><p>第二，所有的I/O操作都可以抽象成事件，每个事件必须有回调函数来处理。acceptor上有连接建立成功、已连接套接字上发送缓冲区空出可以写、通信管道pipe上有数据可以读，这些都是一个个事件，通过事件分发，这些事件都可以一一被检测，并调用对应的回调函数加以处理。</p><h2 id="几种i-o模型和线程模型设计" tabindex="-1"><a class="header-anchor" href="#几种i-o模型和线程模型设计"><span>几种I/O模型和线程模型设计</span></a></h2><p>任何一个网络程序，所做的事情可以总结成下面几种：</p><ul><li>read：从套接字收取数据；</li><li>decode：对收到的数据进行解析；</li><li>compute：根据解析之后的内容，进行计算和处理；</li><li>encode：将处理之后的结果，按照约定的格式进行编码；</li><li>send：最后，通过套接字把结果发送出去。</li></ul><p>这几个过程和套接字最相关的是read和send这两种。接下来，我们总结一下已经学过的几种支持多并发的网络编程技术，引出我们今天的话题，使用poll单线程处理所有I/O。</p><h3 id="fork" tabindex="-1"><a class="header-anchor" href="#fork"><span>fork</span></a></h3><p>第25讲中，我们使用fork来创建子进程，为每个到达的客户连接服务。这张图很好地解释了这个设计模式，可想而知的是，随着客户数的变多，fork的子进程也越来越多，即使客户和服务器之间的交互比较少，这样的子进程也不能被销毁，一直需要存在。使用fork的方式处理非常简单，它的缺点是处理效率不高，fork子进程的开销太大。</p><img src="https://static001.geekbang.org/resource/image/f1/1c/f1045858bc79c5064903c25c6388051c.png" alt=""><h3 id="pthread" tabindex="-1"><a class="header-anchor" href="#pthread"><span>pthread</span></a></h3><p>第26讲中，我们使用了pthread_create创建子线程，因为线程是比进程更轻量级的执行单位，所以它的效率相比fork的方式，有一定的提高。但是，每次创建一个线程的开销仍然是不小的，因此，引入了线程池的概念，预先创建出一个线程池，在每次新连接达到时，从线程池挑选出一个线程为之服务，很好地解决了线程创建的开销。但是，这个模式还是没有解决空闲连接占用资源的问题，如果一个连接在一定时间内没有数据交互，这个连接还是要占用一定的线程资源，直到这个连接消亡为止。</p><img src="https://static001.geekbang.org/resource/image/1c/2c/1c07131ab6ca03d3a5a9092ef20e0b2c.png" alt=""><h3 id="single-reactor-thread" tabindex="-1"><a class="header-anchor" href="#single-reactor-thread"><span>single reactor thread</span></a></h3><p>前面讲到，事件驱动模式是解决高性能、高并发比较好的一种模式。为什么呢？</p><p>因为这种模式是符合大规模生产的需求的。我们的生活中遍地都是类似的模式。比如你去咖啡店喝咖啡，你点了一杯咖啡在一旁喝着，服务员也不会管你，等你有续杯需求的时候，再去和服务员提（触发事件），服务员满足了你的需求，你就继续可以喝着咖啡玩手机。整个柜台的服务方式就是一个事件驱动的方式。</p><p>这里有一张图，解释了这一讲的设计模式。一个reactor线程上同时负责分发acceptor的事件、已连接套接字的I/O事件。</p><img src="https://static001.geekbang.org/resource/image/b8/33/b8627a1a1d32da4b55ac74d4f0230f33.png" alt=""><h3 id="single-reactor-thread-worker-threads" tabindex="-1"><a class="header-anchor" href="#single-reactor-thread-worker-threads"><span>single reactor thread + worker threads</span></a></h3><p>但是上述的设计模式有一个问题，和I/O事件处理相比，应用程序的业务逻辑处理是比较耗时的，比如XML文件的解析、数据库记录的查找、文件资料的读取和传输、计算型工作的处理等，这些工作相对而言比较独立，它们会拖慢整个反应堆模式的执行效率。</p><p>所以，将这些decode、compute、enode型工作放置到另外的线程池中，和反应堆线程解耦，是一个比较明智的选择。反应堆线程只负责处理I/O相关的工作，业务逻辑相关的工作都被裁剪成一个一个的小任务，放到线程池里由空闲的线程来执行。当结果完成后，再交给反应堆线程，由反应堆线程通过套接字将结果发送出去。</p><img src="https://static001.geekbang.org/resource/image/7e/23/7e4505bb75fef4a4bb945e6dc3040823.png" alt=""><h2 id="样例程序" tabindex="-1"><a class="header-anchor" href="#样例程序"><span>样例程序</span></a></h2><p>从今天开始，我们会接触到为本课程量身定制的网络编程框架。使用这个网络编程框架的样例程序如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;lt;lib/acceptor.h&amp;gt;</span></span>
<span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span>#include &amp;quot;lib/event_loop.h&amp;quot;</span></span>
<span class="line"><span>#include &amp;quot;lib/tcp_server.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>char rot13_char(char c) {</span></span>
<span class="line"><span>    if ((c &amp;gt;= &#39;a&#39; &amp;amp;&amp;amp; c &amp;lt;= &#39;m&#39;) || (c &amp;gt;= &#39;A&#39; &amp;amp;&amp;amp; c &amp;lt;= &#39;M&#39;))</span></span>
<span class="line"><span>        return c + 13;</span></span>
<span class="line"><span>    else if ((c &amp;gt;= &#39;n&#39; &amp;amp;&amp;amp; c &amp;lt;= &#39;z&#39;) || (c &amp;gt;= &#39;N&#39; &amp;amp;&amp;amp; c &amp;lt;= &#39;Z&#39;))</span></span>
<span class="line"><span>        return c - 13;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return c;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//连接建立之后的callback</span></span>
<span class="line"><span>int onConnectionCompleted(struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&amp;quot;connection completed\\n&amp;quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//数据读到buffer之后的callback</span></span>
<span class="line"><span>int onMessage(struct buffer *input, struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&amp;quot;get message from tcp connection %s\\n&amp;quot;, tcpConnection-&amp;gt;name);</span></span>
<span class="line"><span>    printf(&amp;quot;%s&amp;quot;, input-&amp;gt;data);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct buffer *output = buffer_new();</span></span>
<span class="line"><span>    int size = buffer_readable_size(input);</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; size; i++) {</span></span>
<span class="line"><span>        buffer_append_char(output, rot13_char(buffer_read_char(input)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    tcp_connection_send_buffer(tcpConnection, output);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//数据通过buffer写完之后的callback</span></span>
<span class="line"><span>int onWriteCompleted(struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&amp;quot;write completed\\n&amp;quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//连接关闭之后的callback</span></span>
<span class="line"><span>int onConnectionClosed(struct tcp_connection *tcpConnection) {</span></span>
<span class="line"><span>    printf(&amp;quot;connection closed\\n&amp;quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int c, char **v) {</span></span>
<span class="line"><span>    //主线程event_loop</span></span>
<span class="line"><span>    struct event_loop *eventLoop = event_loop_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化acceptor</span></span>
<span class="line"><span>    struct acceptor *acceptor = acceptor_init(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始tcp_server，可以指定线程数目，如果线程是0，就只有一个线程，既负责acceptor，也负责I/O</span></span>
<span class="line"><span>    struct TCPserver *tcpServer = tcp_server_init(eventLoop, acceptor, onConnectionCompleted, onMessage,</span></span>
<span class="line"><span>                                                  onWriteCompleted, onConnectionClosed, 0);</span></span>
<span class="line"><span>    tcp_server_start(tcpServer);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // main thread for acceptor</span></span>
<span class="line"><span>    event_loop_run(eventLoop);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个程序的main函数部分只有几行, 因为是第一次接触到，稍微展开介绍一下。</p><p>第49行创建了一个event_loop，即reactor对象，这个event_loop和线程相关联，每个event_loop在线程里执行的是一个无限循环，以便完成事件的分发。</p><p>第52行初始化了acceptor，用来监听在某个端口上。</p><p>第55行创建了一个TCPServer，创建的时候可以指定线程数目，这里线程是0，就只有一个线程，既负责acceptor的连接处理，也负责已连接套接字的I/O处理。这里比较重要的是传入了几个回调函数，分别对应了连接建立完成、数据读取完成、数据发送完成、连接关闭完成几种操作，通过回调函数，让业务程序可以聚焦在业务层开发。</p><p>第57行开启监听。</p><p>第60行运行event_loop无限循环，等待acceptor上有连接建立、新连接上有数据可读等。</p><h2 id="样例程序结果" tabindex="-1"><a class="header-anchor" href="#样例程序结果"><span>样例程序结果</span></a></h2><p>运行这个服务器程序，开启两个telnet客户端，我们看到服务器端的输出如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> $./poll-server-onethread</span></span>
<span class="line"><span>[msg] set poll as dispatcher</span></span>
<span class="line"><span>[msg] add channel fd == 4, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==4</span></span>
<span class="line"><span>[msg] add channel fd == 5, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==5</span></span>
<span class="line"><span>[msg] event loop run, main thread</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 6</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] add channel fd == 6, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==6</span></span>
<span class="line"><span>[msg] get message channel i==2, fd==6</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>get message from tcp connection connection-6</span></span>
<span class="line"><span>afadsfaf</span></span>
<span class="line"><span>[msg] get message channel i==2, fd==6</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>get message from tcp connection connection-6</span></span>
<span class="line"><span>afadsfaf</span></span>
<span class="line"><span>fdafasf</span></span>
<span class="line"><span>[msg] get message channel i==1, fd==5</span></span>
<span class="line"><span>[msg] activate channel fd == 5, revents=2, main thread</span></span>
<span class="line"><span>[msg] new connection established, socket == 7</span></span>
<span class="line"><span>connection completed</span></span>
<span class="line"><span>[msg] add channel fd == 7, main thread</span></span>
<span class="line"><span>[msg] poll added channel fd==7</span></span>
<span class="line"><span>[msg] get message channel i==3, fd==7</span></span>
<span class="line"><span>[msg] activate channel fd == 7, revents=2, main thread</span></span>
<span class="line"><span>get message from tcp connection connection-7</span></span>
<span class="line"><span>sfasggwqe</span></span>
<span class="line"><span>[msg] get message channel i==3, fd==7</span></span>
<span class="line"><span>[msg] activate channel fd == 7, revents=2, main thread</span></span>
<span class="line"><span>[msg] poll delete channel fd==7</span></span>
<span class="line"><span>connection closed</span></span>
<span class="line"><span>[msg] get message channel i==2, fd==6</span></span>
<span class="line"><span>[msg] activate channel fd == 6, revents=2, main thread</span></span>
<span class="line"><span>[msg] poll delete channel fd==6</span></span>
<span class="line"><span>connection closed</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里自始至终都只有一个main thread在工作，可见，单线程的reactor处理多个连接时也可以表现良好。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>这一讲我们总结了几种不同的I/O模型和线程模型设计，并比较了各自不同的优缺点。从这一讲开始，我们将使用自己编写的编程框架来完成业务开发，这一讲使用了poll来处理所有的I/O事件，在下一讲里，我们将会看到如何把acceptor的连接事件和已连接套接字的I/O事件交由不同的线程处理，而这个分离，不过是在应用程序层简单的参数配置而已。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>和往常一样，给你留两道思考题：</p><ol><li>你可以试着修改一下onMessage方法，把它变为期中作业中提到的cd、ls等command实现。</li><li>文章里服务器端的decode-compute-encode是在哪里实现的？你有什么办法来解决业务逻辑和I/O逻辑混在一起么？</li></ol><p>欢迎你在评论区写下你的思考，或者在GitHub上上传你的代码，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,53)]))}const r=s(p,[["render",l]]),o=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/27%20_%20I_O%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8%E9%81%87%E4%B8%8A%E7%BA%BF%E7%A8%8B%EF%BC%9A%E4%BD%BF%E7%94%A8poll%E5%8D%95%E7%BA%BF%E7%A8%8B%E5%A4%84%E7%90%86%E6%89%80%E6%9C%89I_O%E4%BA%8B%E4%BB%B6.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是盛延敏，这里是网络编程实战第27讲，欢迎回来。 我在前面两讲里，分别使用了fork进程和pthread线程来处理多并发，这两种技术使用简单，但是性能却会随着并发数的上涨而快速下降，并不能满足极端高并发的需求。就像第24讲中讲到的一样，这个时候我们需要寻找更好的解决之道，这个解决之道基本的思想就是I/O事件分发。 关于代码，你可以去GitHub...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/27%20_%20I_O%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8%E9%81%87%E4%B8%8A%E7%BA%BF%E7%A8%8B%EF%BC%9A%E4%BD%BF%E7%94%A8poll%E5%8D%95%E7%BA%BF%E7%A8%8B%E5%A4%84%E7%90%86%E6%89%80%E6%9C%89I_O%E4%BA%8B%E4%BB%B6.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是盛延敏，这里是网络编程实战第27讲，欢迎回来。 我在前面两讲里，分别使用了fork进程和pthread线程来处理多并发，这两种技术使用简单，但是性能却会随着并发数的上涨而快速下降，并不能满足极端高并发的需求。就像第24讲中讲到的一样，这个时候我们需要寻找更好的解决之道，这个解决之道基本的思想就是I/O事件分发。 关于代码，你可以去GitHub..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":9.92,"words":2977},"filePathRelative":"posts/网络编程实战/第三模块：性能篇/27 _ I_O多路复用遇上线程：使用poll单线程处理所有I_O事件.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"27 | I/O多路复用遇上线程：使用poll单线程处理所有I/O事件\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/45/01/4576a09c92b2d1d90e1b6373db513001.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第27讲，欢迎回来。</p>\\n<p>我在前面两讲里，分别使用了fork进程和pthread线程来处理多并发，这两种技术使用简单，但是性能却会随着并发数的上涨而快速下降，并不能满足极端高并发的需求。就像第24讲中讲到的一样，这个时候我们需要寻找更好的解决之道，这个解决之道基本的思想就是I/O事件分发。</p>","autoDesc":true}');export{r as comp,o as data};
