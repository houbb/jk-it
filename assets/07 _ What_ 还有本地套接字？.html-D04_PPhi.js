import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<p><audio id="audio" title="07 | What? 还有本地套接字？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/07/fc/0732f7b5f140e400a6742884e65fadfc.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第7讲，欢迎回来。</p><p>上一篇文章中，我们讲了UDP。很多同学都知道TCP和UDP，但是对本地套接字却不甚了解。</p><p>实际上，本地套接字是IPC，也就是本地进程间通信的一种实现方式。除了本地套接字以外，其它技术，诸如管道、共享消息队列等也是进程间通信的常用方法，但因为本地套接字开发便捷，接受度高，所以普遍适用于在同一台主机上进程间通信的各种场景。</p><p>那么今天我们就来学习下本地套接字方面的知识，并且利用本地套接字完成可靠字节流和数据报两种协议。</p><h2 id="从例子开始" tabindex="-1"><a class="header-anchor" href="#从例子开始"><span>从例子开始</span></a></h2><p>现在最火的云计算技术是什么？无疑是Kubernetes和Docker。在Kubernetes和Docker的技术体系中，有很多优秀的设计，比如Kubernetes的CRI（Container Runtime Interface），其思想是将Kubernetes的主要逻辑和Container Runtime的实现解耦。</p><p>我们可以通过netstat命令查看Linux系统内的本地套接字状况，下面这张图列出了路径为/var/run/dockershim.socket的stream类型的本地套接字，可以清楚地看到开启这个套接字的进程为kubelet。kubelet是Kubernetes的一个组件，这个组件负责将控制器和调度器的命令转化为单机上的容器实例。为了实现和容器运行时的解耦，kubelet设计了基于本地套接字的客户端-服务器GRPC调用。</p><p><img src="https://static001.geekbang.org/resource/image/c7/6b/c75a8467a84f30e523917f28f2f4266b.jpg" alt=""><br><br> 眼尖的同学可能发现列表里还有docker-containerd.sock等其他本地套接字，是的，Docker其实也是大量使用了本地套接字技术来构建的。</p><p>如果我们在/var/run目录下将会看到docker使用的本地套接字描述符:</p><img src="https://static001.geekbang.org/resource/image/a0/4d/a0e6f8ca0f9c5727f554323a26a9c14d.jpg" alt=""><h2 id="本地套接字概述" tabindex="-1"><a class="header-anchor" href="#本地套接字概述"><span>本地套接字概述</span></a></h2><p>本地套接字一般也叫做UNIX域套接字，最新的规范已经改叫本地套接字。在前面的TCP/UDP例子中，我们经常使用127.0.0.1完成客户端进程和服务器端进程同时在本机上的通信，那么，这里的本地套接字又是什么呢？</p><p>本地套接字是一种特殊类型的套接字，和TCP/UDP套接字不同。TCP/UDP即使在本地地址通信，也要走系统网络协议栈，而本地套接字，严格意义上说提供了一种单主机跨进程间调用的手段，减少了协议栈实现的复杂度，效率比TCP/UDP套接字都要高许多。类似的IPC机制还有UNIX管道、共享内存和RPC调用等。</p><p>比如X Window实现，如果发现是本地连接，就会走本地套接字，工作效率非常高。</p><p>现在你可以回忆一下，在前面介绍套接字地址时，我们讲到了本地地址，这个本地地址就是本地套接字专属的。</p><img src="https://static001.geekbang.org/resource/image/ed/58/ed49b0f1b658e82cb07a6e1e81f36b58.png" alt=""><h2 id="本地字节流套接字" tabindex="-1"><a class="header-anchor" href="#本地字节流套接字"><span>本地字节流套接字</span></a></h2><p>我们先从字节流本地套接字开始。</p><p>这是一个字节流类型的本地套接字服务器端例子。在这个例子中，服务器程序打开本地套接字后，接收客户端发送来的字节流，并往客户端回送了新的字节流。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include  &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: unixstreamserver &amp;lt;local_path&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int listenfd, connfd;</span></span>
<span class="line"><span>    socklen_t clilen;</span></span>
<span class="line"><span>    struct sockaddr_un cliaddr, servaddr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    listenfd = socket(AF_LOCAL, SOCK_STREAM, 0);</span></span>
<span class="line"><span>    if (listenfd &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;socket create failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char *local_path = argv[1];</span></span>
<span class="line"><span>    unlink(local_path);</span></span>
<span class="line"><span>    bzero(&amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    servaddr.sun_family = AF_LOCAL;</span></span>
<span class="line"><span>    strcpy(servaddr.sun_path, local_path);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (bind(listenfd, (struct sockaddr *) &amp;amp;servaddr, sizeof(servaddr)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;bind failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (listen(listenfd, LISTENQ) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;listen failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    clilen = sizeof(cliaddr);</span></span>
<span class="line"><span>    if ((connfd = accept(listenfd, (struct sockaddr *) &amp;amp;cliaddr, &amp;amp;clilen)) &amp;lt; 0) {</span></span>
<span class="line"><span>        if (errno == EINTR)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;accept failed&amp;quot;);        /* back to for() */</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;accept failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char buf[BUFFER_SIZE];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        bzero(buf, sizeof(buf));</span></span>
<span class="line"><span>        if (read(connfd, buf, BUFFER_SIZE) == 0) {</span></span>
<span class="line"><span>            printf(&amp;quot;client quit&amp;quot;);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        printf(&amp;quot;Receive: %s&amp;quot;, buf);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        char send_line[MAXLINE];</span></span>
<span class="line"><span>        sprintf(send_line, &amp;quot;Hi, %s&amp;quot;, buf);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int nbytes = sizeof(send_line);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (write(connfd, send_line, nbytes) != nbytes)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;write error&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    close(listenfd);</span></span>
<span class="line"><span>    close(connfd);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我对这个程序做一个详细的解释：</p><ul><li>第12～15行非常关键，<strong>这里创建的套接字类型，注意是AF_LOCAL，并且使用字节流格式</strong>。你现在可以回忆一下，TCP的类型是AF_INET和字节流类型；UDP的类型是AF_INET和数据报类型。在前面的文章中，我们提到AF_UNIX也是可以的，基本上可以认为和AF_LOCAL是等价的。</li><li>第17～21行创建了一个本地地址，这里的本地地址和IPv4、IPv6地址可以对应，数据类型为sockaddr_un，这个数据类型中的sun_family需要填写为AF_LOCAL，最为关键的是需要对sun_path设置一个本地文件路径。我们这里还做了一个unlink操作，以便把存在的文件删除掉，这样可以保持幂等性。</li><li>第23～29行，分别执行bind和listen操作，这样就监听在一个本地文件路径标识的套接字上，这和普通的TCP服务端程序没什么区别。</li><li>第41～56行，使用read和write函数从套接字中按照字节流的方式读取和发送数据。</li></ul><p>我在这里着重强调一下本地文件路径。关于本地文件路径，需要明确一点，它必须是“绝对路径”，这样的话，编写好的程序可以在任何目录里被启动和管理。如果是“相对路径”，为了保持同样的目的，这个程序的启动路径就必须固定，这样一来，对程序的管理反而是一个很大的负担。</p><p>另外还要明确一点，这个本地文件，必须是一个“文件”，不能是一个“目录”。如果文件不存在，后面bind操作时会自动创建这个文件。</p><p>还有一点需要牢记，在Linux下，任何文件操作都有权限的概念，应用程序启动时也有应用属主。如果当前启动程序的用户权限不能创建文件，你猜猜会发生什么呢？这里我先卖个关子，一会演示的时候你就会看到结果。</p><p>下面我们再看一下客户端程序。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: unixstreamclient &amp;lt;local_path&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int sockfd;</span></span>
<span class="line"><span>    struct sockaddr_un servaddr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sockfd = socket(AF_LOCAL, SOCK_STREAM, 0);</span></span>
<span class="line"><span>    if (sockfd &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;create socket failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bzero(&amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    servaddr.sun_family = AF_LOCAL;</span></span>
<span class="line"><span>    strcpy(servaddr.sun_path, argv[1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (connect(sockfd, (struct sockaddr *) &amp;amp;servaddr, sizeof(servaddr)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;connect failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char send_line[MAXLINE];</span></span>
<span class="line"><span>    bzero(send_line, MAXLINE);</span></span>
<span class="line"><span>    char recv_line[MAXLINE];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (fgets(send_line, MAXLINE, stdin) != NULL) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int nbytes = sizeof(send_line);</span></span>
<span class="line"><span>        if (write(sockfd, send_line, nbytes) != nbytes)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;write error&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (read(sockfd, recv_line, MAXLINE) == 0)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;server terminated prematurely&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        fputs(recv_line, stdout);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面我带大家理解一下这个客户端程序。</p><ul><li>11～14行创建了一个本地套接字，和前面服务器端程序一样，用的也是字节流类型SOCK_STREAM。</li><li>16～18行初始化目标服务器端的地址。我们知道在TCP编程中，使用的是服务器的IP地址和端口作为目标，在本地套接字中则使用文件路径作为目标标识，sun_path这个字段标识的是目标文件路径，所以这里需要对sun_path进行初始化。</li><li>20行和TCP客户端一样，发起对目标套接字的connect调用，不过由于是本地套接字，并不会有三次握手。</li><li>28～38行从标准输入中读取字符串，向服务器端发送，之后将服务器端传输过来的字符打印到标准输出上。</li></ul><p>总体上，我们可以看到，本地字节流套接字和TCP服务器端、客户端编程最大的差异就是套接字类型的不同。本地字节流套接字识别服务器不再通过IP地址和端口，而是通过本地文件。</p><p>接下来，我们就运行这个程序来加深对此的理解。</p><h3 id="只启动客户端" tabindex="-1"><a class="header-anchor" href="#只启动客户端"><span>只启动客户端</span></a></h3><p>第一个场景中，我们只启动客户端程序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ ./unixstreamclient /tmp/unixstream.sock</span></span>
<span class="line"><span>connect failed: No such file or directory (2)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们看到，由于没有启动服务器端，没有一个本地套接字在/tmp/unixstream.sock这个文件上监听，客户端直接报错，提示我们没有文件存在。</p><h3 id="服务器端监听在无权限的文件路径上" tabindex="-1"><a class="header-anchor" href="#服务器端监听在无权限的文件路径上"><span>服务器端监听在无权限的文件路径上</span></a></h3><p>还记得我们在前面卖的关子吗？在Linux下，执行任何应用程序都有应用属主的概念。在这里，我们让服务器端程序的应用属主没有/var/lib/目录的权限，然后试着启动一下这个服务器程序 ：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ ./unixstreamserver /var/lib/unixstream.sock</span></span>
<span class="line"><span>bind failed: Permission denied (13)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这个结果告诉我们启动服务器端程序的用户，必须对本地监听路径有权限。这个结果和你期望的一致吗？</p><p>试一下root用户启动该程序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>sudo ./unixstreamserver /var/lib/unixstream.sock</span></span>
<span class="line"><span>(阻塞运行中)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们看到，服务器端程序正常运行了。</p><p>打开另外一个shell，我们看到/var/lib下创建了一个本地文件，大小为0，而且文件的最后结尾有一个（=）号。其实这就是bind的时候自动创建出来的文件。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ ls -al /var/lib/unixstream.sock</span></span>
<span class="line"><span>rwxr-xr-x 1 root root 0 Jul 15 12:41 /var/lib/unixstream.sock=</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果我们使用netstat命令查看UNIX域套接字，就会发现unixstreamserver这个进程，监听在/var/lib/unixstream.sock这个文件路径上。</p><p><img src="https://static001.geekbang.org/resource/image/58/b1/58d259d15b7012645d168a9c5d9f3fb1.jpg" alt=""><br><br> 看看，很简单吧，我们写的程序和鼎鼎大名的Kubernetes运行在同一机器上，原理和行为完全一致。</p><h3 id="服务器-客户端应答" tabindex="-1"><a class="header-anchor" href="#服务器-客户端应答"><span>服务器-客户端应答</span></a></h3><p>现在，我们让服务器和客户端都正常启动，并且客户端依次发送字符：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./unixstreamserver /tmp/unixstream.sock</span></span>
<span class="line"><span>Receive: g1</span></span>
<span class="line"><span>Receive: g2</span></span>
<span class="line"><span>Receive: g3</span></span>
<span class="line"><span>client quit</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./unixstreamclient /tmp/unixstream.sock</span></span>
<span class="line"><span>g1</span></span>
<span class="line"><span>Hi, g1</span></span>
<span class="line"><span>g2</span></span>
<span class="line"><span>Hi, g2</span></span>
<span class="line"><span>g3</span></span>
<span class="line"><span>Hi, g3</span></span>
<span class="line"><span>^C</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以看到，服务器端陆续收到客户端发送的字节，同时，客户端也收到了服务器端的应答；最后，当我们使用Ctrl+C，让客户端程序退出时，服务器端也正常退出。</p><h2 id="本地数据报套接字" tabindex="-1"><a class="header-anchor" href="#本地数据报套接字"><span>本地数据报套接字</span></a></h2><p>我们再来看下在本地套接字上使用数据报的服务器端例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include  &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: unixdataserver &amp;lt;local_path&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int socket_fd;</span></span>
<span class="line"><span>    socket_fd = socket(AF_LOCAL, SOCK_DGRAM, 0);</span></span>
<span class="line"><span>    if (socket_fd &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;socket create failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct sockaddr_un servaddr;</span></span>
<span class="line"><span>    char *local_path = argv[1];</span></span>
<span class="line"><span>    unlink(local_path);</span></span>
<span class="line"><span>    bzero(&amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    servaddr.sun_family = AF_LOCAL;</span></span>
<span class="line"><span>    strcpy(servaddr.sun_path, local_path);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (bind(socket_fd, (struct sockaddr *) &amp;amp;servaddr, sizeof(servaddr)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;bind failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char buf[BUFFER_SIZE];</span></span>
<span class="line"><span>    struct sockaddr_un client_addr;</span></span>
<span class="line"><span>    socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        bzero(buf, sizeof(buf));</span></span>
<span class="line"><span>        if (recvfrom(socket_fd, buf, BUFFER_SIZE, 0, (struct sockadd *) &amp;amp;client_addr, &amp;amp;client_len) == 0) {</span></span>
<span class="line"><span>            printf(&amp;quot;client quit&amp;quot;);</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        printf(&amp;quot;Receive: %s \\n&amp;quot;, buf);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        char send_line[MAXLINE];</span></span>
<span class="line"><span>        bzero(send_line, MAXLINE);</span></span>
<span class="line"><span>        sprintf(send_line, &amp;quot;Hi, %s&amp;quot;, buf);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        size_t nbytes = strlen(send_line);</span></span>
<span class="line"><span>        printf(&amp;quot;now sending: %s \\n&amp;quot;, send_line);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (sendto(socket_fd, send_line, nbytes, 0, (struct sockadd *) &amp;amp;client_addr, client_len) != nbytes)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;sendto error&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    close(socket_fd);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本地数据报套接字和前面的字节流本地套接字有以下几点不同：</p><ul><li>第9行创建的本地套接字，<strong>这里创建的套接字类型，注意是AF_LOCAL</strong>，协议类型为SOCK_DGRAM。</li><li>21～23行bind到本地地址之后，没有再调用listen和accept，回忆一下，这其实和UDP的性质一样。</li><li>28～45行使用recvfrom和sendto来进行数据报的收发，不再是read和send，这其实也和UDP网络程序一致。</li></ul><p>然后我们再看一下客户端的例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: unixdataclient &amp;lt;local_path&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int sockfd;</span></span>
<span class="line"><span>    struct sockaddr_un client_addr, server_addr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sockfd = socket(AF_LOCAL, SOCK_DGRAM, 0);</span></span>
<span class="line"><span>    if (sockfd &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;create socket failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bzero(&amp;amp;client_addr, sizeof(client_addr));        /* bind an address for us */</span></span>
<span class="line"><span>    client_addr.sun_family = AF_LOCAL;</span></span>
<span class="line"><span>    strcpy(client_addr.sun_path, tmpnam(NULL));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (bind(sockfd, (struct sockaddr *) &amp;amp;client_addr, sizeof(client_addr)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;bind failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bzero(&amp;amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    server_addr.sun_family = AF_LOCAL;</span></span>
<span class="line"><span>    strcpy(server_addr.sun_path, argv[1]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char send_line[MAXLINE];</span></span>
<span class="line"><span>    bzero(send_line, MAXLINE);</span></span>
<span class="line"><span>    char recv_line[MAXLINE];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (fgets(send_line, MAXLINE, stdin) != NULL) {</span></span>
<span class="line"><span>        int i = strlen(send_line);</span></span>
<span class="line"><span>        if (send_line[i - 1] == &#39;\\n&#39;) {</span></span>
<span class="line"><span>            send_line[i - 1] = 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        size_t nbytes = strlen(send_line);</span></span>
<span class="line"><span>        printf(&amp;quot;now sending %s \\n&amp;quot;, send_line);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (sendto(sockfd, send_line, nbytes, 0, (struct sockaddr *) &amp;amp;server_addr, sizeof(server_addr)) != nbytes)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;sendto error&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int n = recvfrom(sockfd, recv_line, MAXLINE, 0, NULL, NULL);</span></span>
<span class="line"><span>        recv_line[n] = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        fputs(recv_line, stdout);</span></span>
<span class="line"><span>        fputs(&amp;quot;\\n&amp;quot;, stdout);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个程序和UDP网络编程的例子基本是一致的，我们可以把它当作是用本地文件替换了IP地址和端口的UDP程序，不过，这里还是有一个非常大的不同的。</p><p>这个不同点就在16～22行。你可以看到16～22行将本地套接字bind到本地一个路径上，然而UDP客户端程序是不需要这么做的。本地数据报套接字这么做的原因是，它需要指定一个本地路径，以便在服务器端回包时，可以正确地找到地址；而在UDP客户端程序里，数据是可以通过UDP包的本地地址和端口来匹配的。</p><p>下面这段代码就展示了服务器端和客户端通过数据报应答的场景：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> ./unixdataserver /tmp/unixdata.sock</span></span>
<span class="line"><span>Receive: g1</span></span>
<span class="line"><span>now sending: Hi, g1</span></span>
<span class="line"><span>Receive: g2</span></span>
<span class="line"><span>now sending: Hi, g2</span></span>
<span class="line"><span>Receive: g3</span></span>
<span class="line"><span>now sending: Hi, g3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$ ./unixdataclient /tmp/unixdata.sock</span></span>
<span class="line"><span>g1</span></span>
<span class="line"><span>now sending g1</span></span>
<span class="line"><span>Hi, g1</span></span>
<span class="line"><span>g2</span></span>
<span class="line"><span>now sending g2</span></span>
<span class="line"><span>Hi, g2</span></span>
<span class="line"><span>g3</span></span>
<span class="line"><span>now sending g3</span></span>
<span class="line"><span>Hi, g3</span></span>
<span class="line"><span>^C</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以看到，服务器端陆续收到客户端发送的数据报，同时，客户端也收到了服务器端的应答。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>我在开头已经说过，本地套接字作为常用的进程间通信技术，被用于各种适用于在同一台主机上进程间通信的场景。关于本地套接字，我们需要牢记以下两点：</p><ul><li>本地套接字的编程接口和IPv4、IPv6套接字编程接口是一致的，可以支持字节流和数据报两种协议。</li><li>本地套接字的实现效率大大高于IPv4和IPv6的字节流、数据报套接字实现。</li></ul><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>讲完本地套接字之后，我给你留几道思考题。</p><ol><li>在本地套接字字节流类型的客户端-服务器例子中，我们让服务器端以root账号启动，监听在/var/lib/unixstream.sock这个文件上。如果我们让客户端以普通用户权限启动，客户端可以连接上/var/lib/unixstream.sock吗？为什么呢？</li><li>我们看到客户端被杀死后，服务器端也正常退出了。看下退出后打印的日志，你不妨判断一下引起服务器端正常退出的逻辑是什么？</li><li>你有没有想过这样一个奇怪的场景：如果自己不小心写错了代码，本地套接字服务器端是SOCK_DGRAM，客户端使用的是SOCK_STREAM，路径和其他都是正确的，你觉得会发生什么呢？</li></ol><p>欢迎你在评论区写下你的思考，我会和你一起交流这些问题。如果这篇文章帮你弄懂了本地套接字，不妨把它分享给你的朋友或者同事，一起交流一下它吧！</p>`,72)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%80%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%9F%BA%E7%A1%80%E7%AF%87/07%20_%20What_%20%E8%BF%98%E6%9C%89%E6%9C%AC%E5%9C%B0%E5%A5%97%E6%8E%A5%E5%AD%97%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是盛延敏，这里是网络编程实战第7讲，欢迎回来。 上一篇文章中，我们讲了UDP。很多同学都知道TCP和UDP，但是对本地套接字却不甚了解。 实际上，本地套接字是IPC，也就是本地进程间通信的一种实现方式。除了本地套接字以外，其它技术，诸如管道、共享消息队列等也是进程间通信的常用方法，但因为本地套接字开发便捷，接受度高，所以普遍适用于在同一台主机上...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%80%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%9F%BA%E7%A1%80%E7%AF%87/07%20_%20What_%20%E8%BF%98%E6%9C%89%E6%9C%AC%E5%9C%B0%E5%A5%97%E6%8E%A5%E5%AD%97%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是盛延敏，这里是网络编程实战第7讲，欢迎回来。 上一篇文章中，我们讲了UDP。很多同学都知道TCP和UDP，但是对本地套接字却不甚了解。 实际上，本地套接字是IPC，也就是本地进程间通信的一种实现方式。除了本地套接字以外，其它技术，诸如管道、共享消息队列等也是进程间通信的常用方法，但因为本地套接字开发便捷，接受度高，所以普遍适用于在同一台主机上..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":12.76,"words":3829},"filePathRelative":"posts/网络编程实战/第一模块：基础篇/07 _ What_ 还有本地套接字？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"07 | What? 还有本地套接字？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/07/fc/0732f7b5f140e400a6742884e65fadfc.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第7讲，欢迎回来。</p>\\n<p>上一篇文章中，我们讲了UDP。很多同学都知道TCP和UDP，但是对本地套接字却不甚了解。</p>\\n<p>实际上，本地套接字是IPC，也就是本地进程间通信的一种实现方式。除了本地套接字以外，其它技术，诸如管道、共享消息队列等也是进程间通信的常用方法，但因为本地套接字开发便捷，接受度高，所以普遍适用于在同一台主机上进程间通信的各种场景。</p>","autoDesc":true}');export{t as comp,v as data};
