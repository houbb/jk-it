import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const p={};function l(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<p><audio id="audio" title="05 | 使用套接字进行读写：开始交流吧" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/4b/80/4b7f310a64b309ef7f314fc98eaabb80.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第5讲，欢迎回来。</p><p>在前面的章节中，我们讲述了套接字相关的知识，包括套接字的格式，套接字的创建以及TCP连接的建立等。在这一讲里，我来讲一下如何使用创建的套接字收发数据。</p><p>连接建立的根本目的是为了数据的收发。拿我们常用的网购场景举例子，我们在浏览商品或者购买货品的时候，并不会察觉到网络连接的存在，但是我们可以真切感觉到数据在客户端和服务器端有效的传送， 比如浏览商品时商品信息的不断刷新，购买货品时显示购买成功的消息等。</p><p>首先我们先来看一下发送数据。</p><h2 id="发送数据" tabindex="-1"><a class="header-anchor" href="#发送数据"><span>发送数据</span></a></h2><p>发送数据时常用的有三个函数，分别是write、send和sendmsg。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ssize_t write (int socketfd, const void *buffer, size_t size)</span></span>
<span class="line"><span>ssize_t send (int socketfd, const void *buffer, size_t size, int flags)</span></span>
<span class="line"><span>ssize_t sendmsg(int sockfd, const struct msghdr *msg, int flags)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个函数都是单独使用的，使用的场景略有不同：</p><p>第一个函数是常见的文件写函数，如果把socketfd换成文件描述符，就是普通的文件写入。</p><p>如果想指定选项，发送带外数据，就需要使用第二个带flag的函数。所谓带外数据，是一种基于TCP协议的紧急数据，用于客户端-服务器在特定场景下的紧急处理。</p><p>如果想指定多重缓冲区传输数据，就需要使用第三个函数，以结构体msghdr的方式发送数据。</p><p>你看到这里可能会问，既然套接字描述符是一种特殊的描述符，那么在套接字描述符上调用write函数，应该和在普通文件描述符上调用write函数的行为是一致的，都是通过描述符句柄写入指定的数据。</p><p>乍一看，两者的表现形式是一样，内在的区别还是很不一样的。</p><p>对于普通文件描述符而言，一个文件描述符代表了打开的一个文件句柄，通过调用write函数，操作系统内核帮我们不断地往文件系统中写入字节流。注意，写入的字节流大小通常和输入参数size的值是相同的，否则表示出错。</p><p>对于套接字描述符而言，它代表了一个双向连接，在套接字描述符上调用write写入的字节数<strong>有可能</strong>比请求的数量少，这在普通文件描述符情况下是不正常的。</p><p>产生这个现象的原因在于操作系统内核为读取和发送数据做了很多我们表面上看不到的工作。接下来我拿write函数举例，重点阐述发送缓冲区的概念。</p><h3 id="发送缓冲区" tabindex="-1"><a class="header-anchor" href="#发送缓冲区"><span>发送缓冲区</span></a></h3><p>你一定要建立一个概念，当TCP三次握手成功，TCP连接成功建立后，操作系统内核会为每一个连接创建配套的基础设施，比如<strong>发送缓冲区</strong>。</p><p>发送缓冲区的大小可以通过套接字选项来改变，当我们的应用程序调用write函数时，实际所做的事情是把数据<strong>从应用程序中拷贝到操作系统内核的发送缓冲区中</strong>，并不一定是把数据通过套接字写出去。</p><p>这里有几种情况：</p><p>第一种情况很简单，操作系统内核的发送缓冲区足够大，可以直接容纳这份数据，那么皆大欢喜，我们的程序从write调用中退出，返回写入的字节数就是应用程序的数据大小。</p><p>第二种情况是，操作系统内核的发送缓冲区是够大了，不过还有数据没有发送完，或者数据发送完了，但是操作系统内核的发送缓冲区不足以容纳应用程序数据，在这种情况下，你预料的结果是什么呢？报错？还是直接返回？</p><p>操作系统内核并不会返回，也不会报错，而是应用程序被阻塞，也就是说应用程序在write函数调用处停留，不直接返回。术语“挂起”也表达了相同的意思，不过“挂起”是从操作系统内核角度来说的。</p><p>那么什么时候才会返回呢？</p><p>实际上，每个操作系统内核的处理是不同的。大部分UNIX系统的做法是一直等到可以把应用程序数据完全放到操作系统内核的发送缓冲区中，再从系统调用中返回。怎么理解呢？</p><p>别忘了，我们的操作系统内核是很聪明的，当TCP连接建立之后，它就开始运作起来。你可以把发送缓冲区想象成一条包裹流水线，有个聪明且忙碌的工人不断地从流水线上取出包裹（数据），这个工人会按照TCP/IP的语义，将取出的包裹（数据）封装成TCP的MSS包，以及IP的MTU包，最后走数据链路层将数据发送出去。这样我们的发送缓冲区就又空了一部分，于是又可以继续从应用程序搬一部分数据到发送缓冲区里，这样一直进行下去，到某一个时刻，应用程序的数据可以完全放置到发送缓冲区里。在这个时候，write阻塞调用返回。注意返回的时刻，应用程序数据并没有全部被发送出去，发送缓冲区里还有部分数据，这部分数据会在稍后由操作系统内核通过网络发送出去。</p><img src="https://static001.geekbang.org/resource/image/fd/dc/fdcdc766c6a6ebb7fbf15bb2d1e58bdc.png" alt=""><h2 id="读取数据" tabindex="-1"><a class="header-anchor" href="#读取数据"><span>读取数据</span></a></h2><p>我们可以注意到，套接字描述本身和本地文件描述符并无区别，<strong>在UNIX的世界里万物都是文件</strong>，这就意味着可以将套接字描述符传递给那些原先为处理本地文件而设计的函数。这些函数包括read和write交换数据的函数。</p><h3 id="read函数" tabindex="-1"><a class="header-anchor" href="#read函数"><span>read函数</span></a></h3><p>让我们先从最简单的read函数开始看起，这个函数的原型如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ssize_t read (int socketfd, void *buffer, size_t size)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>read函数要求操作系统内核从套接字描述字socketfd<strong>读取最多多少个字节（size），并将结果存储到buffer中。返回值告诉我们实际读取的字节数目，也有一些特殊情况，如果返回值为0，表示EOF（end-of-file），这在网络中表示对端发送了FIN包，要处理断连的情况</strong>；如果返回值为-1，表示出错。当然，如果是非阻塞I/O，情况会略有不同，在后面的提高篇中我们会重点讲述非阻塞I/O的特点。</p><p>注意这里是最多读取size个字节。如果我们想让应用程序每次都读到size个字节，就需要编写下面的函数，不断地循环读取。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/* 从socketfd描述字中读取&amp;quot;size&amp;quot;个字节. */</span></span>
<span class="line"><span>size_t readn(int fd, void *buffer, size_t size) {</span></span>
<span class="line"><span>    char *buffer_pointer = buffer;</span></span>
<span class="line"><span>    int length = size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (length &amp;gt; 0) {</span></span>
<span class="line"><span>        int result = read(fd, buffer_pointer, length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (result &amp;lt; 0) {</span></span>
<span class="line"><span>            if (errno == EINTR)</span></span>
<span class="line"><span>                continue;     /* 考虑非阻塞的情况，这里需要再次调用read */</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                return (-1);</span></span>
<span class="line"><span>        } else if (result == 0)</span></span>
<span class="line"><span>            break;                /* EOF(End of File)表示套接字关闭 */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        length -= result;</span></span>
<span class="line"><span>        buffer_pointer += result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return (size - length);        /* 返回的是实际读取的字节数*/</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对这个程序稍微解释下：</p><ul><li>6-19行的循环条件表示的是，在没读满size个字节之前，一直都要循环下去。</li><li>10-11行表示的是非阻塞I/O的情况下，没有数据可以读，需要继续调用read。</li><li>14-15行表示读到对方发出的FIN包，表现形式是EOF，此时需要关闭套接字。</li><li>17-18行，需要读取的字符数减少，缓存指针往下移动。</li><li>20行是在读取EOF跳出循环后，返回实际读取的字符数。</li></ul><h2 id="缓冲区实验" tabindex="-1"><a class="header-anchor" href="#缓冲区实验"><span>缓冲区实验</span></a></h2><p>我们用一个客户端-服务器的例子来解释一下读取缓冲区和发送缓冲区的概念。在这个例子中客户端不断地发送数据，服务器端每读取一段数据之后进行休眠，以模拟实际业务处理所需要的时间。</p><h3 id="服务器端读取数据程序" tabindex="-1"><a class="header-anchor" href="#服务器端读取数据程序"><span>服务器端读取数据程序</span></a></h3><p>下面是服务器端读取数据的程序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void read_data(int sockfd) {</span></span>
<span class="line"><span>    ssize_t n;</span></span>
<span class="line"><span>    char buf[1024];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int time = 0;</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        fprintf(stdout, &amp;quot;block in read\\n&amp;quot;);</span></span>
<span class="line"><span>        if ((n = readn(sockfd, buf, 1024)) == 0)</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        time++;</span></span>
<span class="line"><span>        fprintf(stdout, &amp;quot;1K read for %d \\n&amp;quot;, time);</span></span>
<span class="line"><span>        usleep(1000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listenfd, connfd;</span></span>
<span class="line"><span>    socklen_t clilen;</span></span>
<span class="line"><span>    struct sockaddr_in cliaddr, servaddr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    listenfd = socket(AF_INET, SOCK_STREAM, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bzero(&amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    servaddr.sin_family = AF_INET;</span></span>
<span class="line"><span>    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);</span></span>
<span class="line"><span>    servaddr.sin_port = htons(12345);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* bind到本地地址，端口为12345 */</span></span>
<span class="line"><span>    bind(listenfd, (struct sockaddr *) &amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    /* listen的backlog为1024 */</span></span>
<span class="line"><span>    listen(listenfd, 1024);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 循环处理用户请求 */</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        clilen = sizeof(cliaddr);</span></span>
<span class="line"><span>        connfd = accept(listenfd, (struct sockaddr *) &amp;amp;cliaddr, &amp;amp;clilen);</span></span>
<span class="line"><span>        read_data(connfd);   /* 读取数据 */</span></span>
<span class="line"><span>        close(connfd);          /* 关闭连接套接字，注意不是监听套接字*/</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对服务器端程序解释如下：</p><ul><li>21-35行先后创建了socket套接字，bind到对应地址和端口，并开始调用listen接口监听；</li><li>38-42行循环等待连接，通过accept获取实际的连接，并开始读取数据；</li><li>8-15行实际每次读取1K数据，之后休眠1秒，用来模拟服务器端处理时延。</li></ul><h3 id="客户端发送数据程序" tabindex="-1"><a class="header-anchor" href="#客户端发送数据程序"><span>客户端发送数据程序</span></a></h3><p>下面是客户端发送数据的程序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define MESSAGE_SIZE 102400</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void send_data(int sockfd) {</span></span>
<span class="line"><span>    char *query;</span></span>
<span class="line"><span>    query = malloc(MESSAGE_SIZE + 1);</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; MESSAGE_SIZE; i++) {</span></span>
<span class="line"><span>        query[i] = &#39;a&#39;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    query[MESSAGE_SIZE] = &#39;\\0&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const char *cp;</span></span>
<span class="line"><span>    cp = query;</span></span>
<span class="line"><span>    size_t remaining = strlen(query);</span></span>
<span class="line"><span>    while (remaining) {</span></span>
<span class="line"><span>        int n_written = send(sockfd, cp, remaining, 0);</span></span>
<span class="line"><span>        fprintf(stdout, &amp;quot;send into buffer %ld \\n&amp;quot;, n_written);</span></span>
<span class="line"><span>        if (n_written &amp;lt;= 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;send failed&amp;quot;);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        remaining -= n_written;</span></span>
<span class="line"><span>        cp += n_written;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int sockfd;</span></span>
<span class="line"><span>    struct sockaddr_in servaddr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (argc != 2)</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: tcpclient &amp;lt;IPaddress&amp;gt;&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sockfd = socket(AF_INET, SOCK_STREAM, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    bzero(&amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    servaddr.sin_family = AF_INET;</span></span>
<span class="line"><span>    servaddr.sin_port = htons(12345);</span></span>
<span class="line"><span>    inet_pton(AF_INET, argv[1], &amp;amp;servaddr.sin_addr);</span></span>
<span class="line"><span>    int connect_rt = connect(sockfd, (struct sockaddr *) &amp;amp;servaddr, sizeof(servaddr));</span></span>
<span class="line"><span>    if (connect_rt &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;connect failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    send_data(sockfd);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对客户端程序解释如下：</p><ul><li>31-37行先后创建了socket套接字，调用connect向对应服务器端发起连接请求</li><li>43行在连接建立成功后，调用send_data发送数据</li><li>6-11行初始化了一个长度为MESSAGE_SIZE的字符串流</li><li>16-25行调用send函数将MESSAGE_SIZE长度的字符串流发送出去</li></ul><h3 id="实验一-观察客户端数据发送行为" tabindex="-1"><a class="header-anchor" href="#实验一-观察客户端数据发送行为"><span>实验一: 观察客户端数据发送行为</span></a></h3><p>客户端程序发送了一个很大的字节流，程序运行起来之后，我们会看到服务端不断地在屏幕上打印出读取字节流的过程：</p><p><img src="https://static001.geekbang.org/resource/image/34/1d/3455bb84f5ee020bc14bc1e15ead4d1d.jpg" alt=""><br><br> 而客户端直到最后所有的字节流发送完毕才打印出下面的一句话，说明在此之前send函数一直都是阻塞的，也就是说<strong>阻塞式套接字最终发送返回的实际写入字节数和请求字节数是相等的。</strong></p><p>而关于非阻塞套接字的操作，我会在后面的文章中讲解。</p><h3 id="实验二-服务端处理变慢" tabindex="-1"><a class="header-anchor" href="#实验二-服务端处理变慢"><span>实验二: 服务端处理变慢</span></a></h3><p>如果我们把服务端的休眠时间稍微调大，把客户端发送的字节数从10240000调整为1024000，再次运行刚才的例子，我们会发现，客户端很快打印出一句话：</p><p><img src="https://static001.geekbang.org/resource/image/b5/e6/b56f01f842b2344e1480ff519d1627e6.jpg" alt=""><br><br> 但与此同时，服务端读取程序还在屏幕上不断打印读取数据的进度，显示出服务端读取程序还在辛苦地从缓冲区中读取数据。</p><p>通过这个例子我想再次强调一下：</p><p><strong>发送成功仅仅表示的是数据被拷贝到了发送缓冲区中，并不意味着连接对端已经收到所有的数据。至于什么时候发送到对端的接收缓冲区，或者更进一步说，什么时候被对方应用程序缓冲所接收，对我们而言完全都是透明的。</strong></p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>这一讲重点讲述了通过send和read来收发数据包，你需要牢记以下两点：</p><ul><li>对于send来说，返回成功仅仅表示数据写到发送缓冲区成功，并不表示对端已经成功收到。</li><li>对于read来说，需要循环读取数据，并且需要考虑EOF等异常条件。</li></ul><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>最后你不妨思考一下，既然缓冲区如此重要，我们可不可以把缓冲区搞得大大的，这样不就可以提高应用程序的吞吐量了么？你可以想一想这个方法可行吗？另外你可以自己总结一下，一段数据流从应用程序发送端，一直到应用程序接收端，总共经过了多少次拷贝？</p><p>欢迎你在评论区与我分享你的答案，如果你理解了套接字读写的过程，也欢迎把这篇文章分享给你的朋友或者同事。</p>`,65)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%80%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%9F%BA%E7%A1%80%E7%AF%87/05%20_%20%E4%BD%BF%E7%94%A8%E5%A5%97%E6%8E%A5%E5%AD%97%E8%BF%9B%E8%A1%8C%E8%AF%BB%E5%86%99%EF%BC%9A%E5%BC%80%E5%A7%8B%E4%BA%A4%E6%B5%81%E5%90%A7.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是盛延敏，这里是网络编程实战第5讲，欢迎回来。 在前面的章节中，我们讲述了套接字相关的知识，包括套接字的格式，套接字的创建以及TCP连接的建立等。在这一讲里，我来讲一下如何使用创建的套接字收发数据。 连接建立的根本目的是为了数据的收发。拿我们常用的网购场景举例子，我们在浏览商品或者购买货品的时候，并不会察觉到网络连接的存在，但是我们可以真切感觉...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%80%E6%A8%A1%E5%9D%97%EF%BC%9A%E5%9F%BA%E7%A1%80%E7%AF%87/05%20_%20%E4%BD%BF%E7%94%A8%E5%A5%97%E6%8E%A5%E5%AD%97%E8%BF%9B%E8%A1%8C%E8%AF%BB%E5%86%99%EF%BC%9A%E5%BC%80%E5%A7%8B%E4%BA%A4%E6%B5%81%E5%90%A7.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是盛延敏，这里是网络编程实战第5讲，欢迎回来。 在前面的章节中，我们讲述了套接字相关的知识，包括套接字的格式，套接字的创建以及TCP连接的建立等。在这一讲里，我来讲一下如何使用创建的套接字收发数据。 连接建立的根本目的是为了数据的收发。拿我们常用的网购场景举例子，我们在浏览商品或者购买货品的时候，并不会察觉到网络连接的存在，但是我们可以真切感觉..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":11.27,"words":3382},"filePathRelative":"posts/网络编程实战/第一模块：基础篇/05 _ 使用套接字进行读写：开始交流吧.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"05 | 使用套接字进行读写：开始交流吧\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/4b/80/4b7f310a64b309ef7f314fc98eaabb80.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第5讲，欢迎回来。</p>\\n<p>在前面的章节中，我们讲述了套接字相关的知识，包括套接字的格式，套接字的创建以及TCP连接的建立等。在这一讲里，我来讲一下如何使用创建的套接字收发数据。</p>","autoDesc":true}');export{t as comp,v as data};
