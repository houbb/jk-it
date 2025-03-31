import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<p><audio id="audio" title="11 | 优雅地关闭还是粗暴地关闭 ?" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/de/c2/de42764fa62843355aeb21af76ce1bc2.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第11讲，欢迎回来。</p><p>上一讲我们讲到了TCP的四次挥手，其中发起连接关闭的一方会有一段时间处于TIME_WAIT状态。那么究竟如何来发起连接关闭呢？这一讲我们就来讨论一下。</p><p>我们知道，一个TCP连接需要经过三次握手进入数据传输阶段，最后来到连接关闭阶段。在最后的连接关闭阶段，我们需要重点关注的是“半连接”状态。</p><p>因为TCP是双向的，这里说的方向，指的是数据流的写入-读出的方向。</p><p>比如客户端到服务器端的方向，指的是客户端通过套接字接口，向服务器端发送TCP报文；而服务器端到客户端方向则是另一个传输方向。在绝大数情况下，TCP连接都是先关闭一个方向，此时另外一个方向还是可以正常进行数据传输。</p><p>举个例子，客户端主动发起连接的中断，将自己到服务器端的数据流方向关闭，此时，客户端不再往服务器端写入数据，服务器端读完客户端数据后就不会再有新的报文到达。但这并不意味着，TCP连接已经完全关闭，很有可能的是，服务器端正在对客户端的最后报文进行处理，比如去访问数据库，存入一些数据；或者是计算出某个客户端需要的值，当完成这些操作之后，服务器端把结果通过套接字写给客户端，我们说这个套接字的状态此时是“半关闭”的。最后，服务器端才有条不紊地关闭剩下的半个连接，结束这一段TCP连接的使命。</p><p>当然，我这里描述的是服务器端“优雅”地关闭了连接。如果服务器端处理不好，就会导致最后的关闭过程是“粗暴”的，达不到我们上面描述的“优雅”关闭的目标，形成的后果，很可能是服务器端处理完的信息没办法正常传送给客户端，破坏了用户侧的使用场景。</p><p>接下来我们就来看看关闭连接时，都有哪些方式呢？</p><h2 id="close函数" tabindex="-1"><a class="header-anchor" href="#close函数"><span>close函数</span></a></h2><p>首先，我们来看最常见的close函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int close(int sockfd)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这个函数很简单，对已连接的套接字执行close操作就可以，若成功则为0，若出错则为-1。</p><p>这个函数会对套接字引用计数减一，一旦发现套接字引用计数到0，就会对套接字进行彻底释放，并且会关闭<strong>TCP两个方向的数据流</strong>。</p><p>套接字引用计数是什么意思呢？因为套接字可以被多个进程共享，你可以理解为我们给每个套接字都设置了一个积分，如果我们通过fork的方式产生子进程，套接字就会积分+1， 如果我们调用一次close函数，套接字积分就会-1。这就是套接字引用计数的含义。</p><p>close函数具体是如何关闭两个方向的数据流呢？</p><p>在输入方向，系统内核会将该套接字设置为不可读，任何读操作都会返回异常。</p><p>在输出方向，系统内核尝试将发送缓冲区的数据发送给对端，并最后向对端发送一个FIN报文，接下来如果再对该套接字进行写操作会返回异常。</p><p>如果对端没有检测到套接字已关闭，还继续发送报文，就会收到一个RST报文，告诉对端：“Hi, 我已经关闭了，别再给我发数据了。”</p><p>我们会发现，close函数并不能帮助我们关闭连接的一个方向，那么如何在需要的时候关闭一个方向呢？幸运的是，设计TCP协议的人帮我们想好了解决方案，这就是shutdown函数。</p><h2 id="shutdown函数" tabindex="-1"><a class="header-anchor" href="#shutdown函数"><span>shutdown函数</span></a></h2><p>shutdown函数的原型是这样的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int shutdown(int sockfd, int howto)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>对已连接的套接字执行shutdown操作，若成功则为0，若出错则为-1。</p><p>howto是这个函数的设置选项，它的设置有三个主要选项：</p><ul><li>SHUT_RD(0)：关闭连接的“读”这个方向，对该套接字进行读操作直接返回EOF。从数据角度来看，套接字上接收缓冲区已有的数据将被丢弃，如果再有新的数据流到达，会对数据进行ACK，然后悄悄地丢弃。也就是说，对端还是会接收到ACK，在这种情况下根本不知道数据已经被丢弃了。</li><li>SHUT_WR(1)：关闭连接的“写”这个方向，这就是常被称为”半关闭“的连接。此时，不管套接字引用计数的值是多少，都会直接关闭连接的写方向。套接字上发送缓冲区已有的数据将被立即发送出去，并发送一个FIN报文给对端。应用程序如果对该套接字进行写操作会报错。</li><li>SHUT_RDWR(2)：相当于SHUT_RD和SHUT_WR操作各一次，关闭套接字的读和写两个方向。</li></ul><p>讲到这里，不知道你是不是有和我当初一样的困惑，使用SHUT_RDWR来调用shutdown不是和close基本一样吗，都是关闭连接的读和写两个方向。</p><p>其实，这两个还是有差别的。</p><p>第一个差别：close会关闭连接，并释放所有连接对应的资源，而shutdown并不会释放掉套接字和所有的资源。</p><p>第二个差别：close存在引用计数的概念，并不一定导致该套接字不可用；shutdown则不管引用计数，直接使得该套接字不可用，如果有别的进程企图使用该套接字，将会受到影响。</p><p>第三个差别：close的引用计数导致不一定会发出FIN结束报文，而shutdown则总是会发出FIN结束报文，这在我们打算关闭连接通知对端的时候，是非常重要的。</p><h2 id="体会close和shutdown的差别" tabindex="-1"><a class="header-anchor" href="#体会close和shutdown的差别"><span>体会close和shutdown的差别</span></a></h2><p>下面，我们通过构建一组客户端和服务器程序，来进行close和shutdown的实验。</p><p>客户端程序，从标准输入不断接收用户输入，把输入的字符串通过套接字发送给服务器端，同时，将服务器端的应答显示到标准输出上。</p><p>如果用户输入了“close”，则会调用close函数关闭连接，休眠一段时间，等待服务器端处理后退出；如果用户输入了“shutdown”，调用shutdown函数关闭连接的写方向，注意我们不会直接退出，而是会继续等待服务器端的应答，直到服务器端完成自己的操作，在另一个方向上完成关闭。</p><p>在这里，我们会第一次接触到select多路复用，这里不展开讲，你只需要记住，使用select使得我们可以同时完成对连接套接字和标准输入两个I/O对象的处理。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span># define    MAXLINE     4096</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: graceclient &amp;lt;IPaddress&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    int socket_fd;</span></span>
<span class="line"><span>    socket_fd = socket(AF_INET, SOCK_STREAM, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct sockaddr_in server_addr;</span></span>
<span class="line"><span>    bzero(&amp;amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    server_addr.sin_family = AF_INET;</span></span>
<span class="line"><span>    server_addr.sin_port = htons(SERV_PORT);</span></span>
<span class="line"><span>    inet_pton(AF_INET, argv[1], &amp;amp;server_addr.sin_addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    socklen_t server_len = sizeof(server_addr);</span></span>
<span class="line"><span>    int connect_rt = connect(socket_fd, (struct sockaddr *) &amp;amp;server_addr, server_len);</span></span>
<span class="line"><span>    if (connect_rt &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;connect failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char send_line[MAXLINE], recv_line[MAXLINE + 1];</span></span>
<span class="line"><span>    int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fd_set readmask;</span></span>
<span class="line"><span>    fd_set allreads;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    FD_ZERO(&amp;amp;allreads);</span></span>
<span class="line"><span>    FD_SET(0, &amp;amp;allreads);</span></span>
<span class="line"><span>    FD_SET(socket_fd, &amp;amp;allreads);</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        readmask = allreads;</span></span>
<span class="line"><span>        int rc = select(socket_fd + 1, &amp;amp;readmask, NULL, NULL, NULL);</span></span>
<span class="line"><span>        if (rc &amp;lt;= 0)</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;select failed&amp;quot;);</span></span>
<span class="line"><span>        if (FD_ISSET(socket_fd, &amp;amp;readmask)) {</span></span>
<span class="line"><span>            n = read(socket_fd, recv_line, MAXLINE);</span></span>
<span class="line"><span>            if (n &amp;lt; 0) {</span></span>
<span class="line"><span>                error(1, errno, &amp;quot;read error&amp;quot;);</span></span>
<span class="line"><span>            } else if (n == 0) {</span></span>
<span class="line"><span>                error(1, 0, &amp;quot;server terminated \\n&amp;quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            recv_line[n] = 0;</span></span>
<span class="line"><span>            fputs(recv_line, stdout);</span></span>
<span class="line"><span>            fputs(&amp;quot;\\n&amp;quot;, stdout);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (FD_ISSET(0, &amp;amp;readmask)) {</span></span>
<span class="line"><span>            if (fgets(send_line, MAXLINE, stdin) != NULL) {</span></span>
<span class="line"><span>                if (strncmp(send_line, &amp;quot;shutdown&amp;quot;, 8) == 0) {</span></span>
<span class="line"><span>                    FD_CLR(0, &amp;amp;allreads);</span></span>
<span class="line"><span>                    if (shutdown(socket_fd, 1)) {</span></span>
<span class="line"><span>                        error(1, errno, &amp;quot;shutdown failed&amp;quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } else if (strncmp(send_line, &amp;quot;close&amp;quot;, 5) == 0) {</span></span>
<span class="line"><span>                    FD_CLR(0, &amp;amp;allreads);</span></span>
<span class="line"><span>                    if (close(socket_fd)) {</span></span>
<span class="line"><span>                        error(1, errno, &amp;quot;close failed&amp;quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    sleep(6);</span></span>
<span class="line"><span>                    exit(0);</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    int i = strlen(send_line);</span></span>
<span class="line"><span>                    if (send_line[i - 1] == &#39;\\n&#39;) {</span></span>
<span class="line"><span>                        send_line[i - 1] = 0;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    printf(&amp;quot;now sending %s\\n&amp;quot;, send_line);</span></span>
<span class="line"><span>                    size_t rt = write(socket_fd, send_line, strlen(send_line));</span></span>
<span class="line"><span>                    if (rt &amp;lt; 0) {</span></span>
<span class="line"><span>                        error(1, errno, &amp;quot;write failed &amp;quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    printf(&amp;quot;send bytes: %zu \\n&amp;quot;, rt);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我对这个程序的细节展开解释一下：</p><p>第一部分是套接字的创建和select初始工作：</p><ul><li>9-10行创建了一个TCP套接字；</li><li>12-16行设置了连接的目标服务器IPv4地址，绑定到了指定的IP和端口；</li><li>18-22行使用创建的套接字，向目标IPv4地址发起连接请求；</li><li>30-32行为使用select做准备，初始化描述字集合，这部分我会在后面详细解释，这里就不再深入。</li></ul><p>第二部分是程序的主体部分，从33-80行， 使用select多路复用观测在连接套接字和标准输入上的I/O事件，其中：</p><ul><li>38-48行：当连接套接字上有数据可读，将数据读入到程序缓冲区中。40-41行，如果有异常则报错退出；42-43行如果读到服务器端发送的EOF则正常退出。</li><li>49-77行：当标准输入上有数据可读，读入后进行判断。如果输入的是“shutdown”，则关闭标准输入的I/O事件感知，并调用shutdown函数关闭写方向；如果输入的是”close“，则调用close函数关闭连接；64-74行处理正常的输入，将回车符截掉，调用write函数，通过套接字将数据发送给服务器端。</li></ul><p>服务器端程序稍微简单一点，连接建立之后，打印出接收的字节，并重新格式化后，发送给客户端。</p><p>服务器端程序有一点需要注意，那就是对SIGPIPE这个信号的处理。后面我会结合程序的结果展开说明。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void sig_int(int signo) {</span></span>
<span class="line"><span>    printf(&amp;quot;\\nreceived %d datagrams\\n&amp;quot;, count);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listenfd;</span></span>
<span class="line"><span>    listenfd = socket(AF_INET, SOCK_STREAM, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct sockaddr_in server_addr;</span></span>
<span class="line"><span>    bzero(&amp;amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    server_addr.sin_family = AF_INET;</span></span>
<span class="line"><span>    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);</span></span>
<span class="line"><span>    server_addr.sin_port = htons(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rt1 = bind(listenfd, (struct sockaddr *) &amp;amp;server_addr, sizeof(server_addr));</span></span>
<span class="line"><span>    if (rt1 &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;bind failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int rt2 = listen(listenfd, LISTENQ);</span></span>
<span class="line"><span>    if (rt2 &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;listen failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    signal(SIGINT, sig_int);</span></span>
<span class="line"><span>    signal(SIGPIPE, SIG_IGN);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int connfd;</span></span>
<span class="line"><span>    struct sockaddr_in client_addr;</span></span>
<span class="line"><span>    socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((connfd = accept(listenfd, (struct sockaddr *) &amp;amp;client_addr, &amp;amp;client_len)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;bind failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char message[MAXLINE];</span></span>
<span class="line"><span>    count = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        int n = read(connfd, message, MAXLINE);</span></span>
<span class="line"><span>        if (n &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;error read&amp;quot;);</span></span>
<span class="line"><span>        } else if (n == 0) {</span></span>
<span class="line"><span>            error(1, 0, &amp;quot;client closed \\n&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        message[n] = 0;</span></span>
<span class="line"><span>        printf(&amp;quot;received %d bytes: %s\\n&amp;quot;, n, message);</span></span>
<span class="line"><span>        count++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        char send_line[MAXLINE];</span></span>
<span class="line"><span>        sprintf(send_line, &amp;quot;Hi, %s&amp;quot;, message);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        sleep(5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int write_nc = send(connfd, send_line, strlen(send_line), 0);</span></span>
<span class="line"><span>        printf(&amp;quot;send bytes: %zu \\n&amp;quot;, write_nc);</span></span>
<span class="line"><span>        if (write_nc &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;error write&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务器端程序的细节也展开解释一下：</p><p>第一部分是套接字和连接创建过程：</p><ul><li>11-12行创建了一个TCP套接字；</li><li>14-18行设置了本地服务器IPv4地址，绑定到了ANY地址和指定的端口；</li><li>20-40行使用创建的套接字，以此执行bind、listen和accept操作，完成连接建立。</li></ul><p>第二部分是程序的主体，通过read函数获取客户端传送来的数据流，并回送给客户端：</p><ul><li>51-52行显示收到的字符串，在56行对原字符串进行重新格式化，之后调用send函数将数据发送给客户端。注意，在发送之前，让服务器端程序休眠了5秒，以模拟服务器端处理的时间。</li></ul><p>我们启动服务器，再启动客户端，依次在标准输入上输入data1、data2和close，观察一段时间后我们看到：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./graceclient 127.0.0.1</span></span>
<span class="line"><span>data1</span></span>
<span class="line"><span>now sending data1</span></span>
<span class="line"><span>send bytes:5</span></span>
<span class="line"><span>data2</span></span>
<span class="line"><span>now sending data2</span></span>
<span class="line"><span>send bytes:5</span></span>
<span class="line"><span>close</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./graceserver</span></span>
<span class="line"><span>received 5 bytes: data1</span></span>
<span class="line"><span>send bytes: 9</span></span>
<span class="line"><span>received 5 bytes: data2</span></span>
<span class="line"><span>send bytes: 9</span></span>
<span class="line"><span>client closed</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端依次发送了data1和data2，服务器端也正常接收到data1和data2。在客户端close掉整个连接之后，服务器端接收到SIGPIPE信号，直接退出。客户端并没有收到服务器端的应答数据。</p><p>我在下面放了一张图，这张图详细解释了客户端和服务器端交互的时序图。因为客户端调用close函数关闭了整个连接，当服务器端发送的“Hi, data1”分组到底时，客户端给回送一个RST分组；服务器端再次尝试发送“Hi, data2”第二个应答分组时，系统内核通知SIGPIPE信号。这是因为，在RST的套接字进行写操作，会直接触发SIGPIPE信号。</p><p>这回知道你的程序莫名其妙终止的原因了吧。</p><p><img src="https://static001.geekbang.org/resource/image/f2/9a/f283b804c7e33e25a900fedc8c36f09a.png" alt=""><br><br> 我们可以像这样注册一个信号处理函数，对SIGPIPE信号进行处理，避免程序莫名退出：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>static void sig_pipe(int signo) {</span></span>
<span class="line"><span>    printf(&amp;quot;\\nreceived %d datagrams\\n&amp;quot;, count);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>signal(SIGINT, sig_pipe);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，再次启动服务器，再启动客户端，依次在标准输入上输入data1、data2和shutdown函数，观察一段时间后我们看到：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./graceclient 127.0.0.1</span></span>
<span class="line"><span>data1</span></span>
<span class="line"><span>now sending data1</span></span>
<span class="line"><span>send bytes:5</span></span>
<span class="line"><span>data2</span></span>
<span class="line"><span>now sending data2</span></span>
<span class="line"><span>send bytes:5</span></span>
<span class="line"><span>shutdown</span></span>
<span class="line"><span>Hi, data1</span></span>
<span class="line"><span>Hi，data2</span></span>
<span class="line"><span>server terminated</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./graceserver</span></span>
<span class="line"><span>received 5 bytes: data1</span></span>
<span class="line"><span>send bytes: 9</span></span>
<span class="line"><span>received 5 bytes: data2</span></span>
<span class="line"><span>send bytes: 9</span></span>
<span class="line"><span>client closed</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和前面的结果不同，服务器端输出了data1、data2；客户端也输出了“Hi,data1”和“Hi,data2”，客户端和服务器端各自完成了自己的工作后，正常退出。</p><p>我们再看下客户端和服务器端交互的时序图。因为客户端调用shutdown函数只是关闭连接的一个方向，服务器端到客户端的这个方向还可以继续进行数据的发送和接收，所以“Hi,data1”和“Hi,data2”都可以正常传送；当服务器端读到EOF时，立即向客户端发送了FIN报文，客户端在read函数中感知了EOF，也进行了正常退出。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>在这一讲中，我们讲述了close函数关闭连接的方法，使用close函数关闭连接有两个需要明确的地方。</p><ul><li>close函数只是把套接字引用计数减1，未必会立即关闭连接；</li><li>close函数如果在套接字引用计数达到0时，立即终止读和写两个方向的数据传送。</li></ul><p>基于这两个确定，在期望关闭连接其中一个方向时，应该使用shutdown函数。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>和往常一样，给你留两道思考题。</p><p>第一道题，你可以看到在今天的服务器端程序中，直接调用<code>exit(0)</code>完成了FIN报文的发送，这是为什么呢？为什么不调用close函数或shutdown函数呢？</p><p>第二道题关于关于信号量处理，今天的程序中，使用的是<code>SIG_IGN</code>默认处理，你知道默认处理和自定义函数处理的区别吗？不妨查查资料，了解一下。</p><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起来交流。</p>`,72)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%8F%90%E9%AB%98%E7%AF%87/11%20_%20%E4%BC%98%E9%9B%85%E5%9C%B0%E5%85%B3%E9%97%AD%E8%BF%98%E6%98%AF%E7%B2%97%E6%9A%B4%E5%9C%B0%E5%85%B3%E9%97%AD%20_.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是盛延敏，这里是网络编程实战第11讲，欢迎回来。 上一讲我们讲到了TCP的四次挥手，其中发起连接关闭的一方会有一段时间处于TIME_WAIT状态。那么究竟如何来发起连接关闭呢？这一讲我们就来讨论一下。 我们知道，一个TCP连接需要经过三次握手进入数据传输阶段，最后来到连接关闭阶段。在最后的连接关闭阶段，我们需要重点关注的是“半连接”状态。 因为...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%8F%90%E9%AB%98%E7%AF%87/11%20_%20%E4%BC%98%E9%9B%85%E5%9C%B0%E5%85%B3%E9%97%AD%E8%BF%98%E6%98%AF%E7%B2%97%E6%9A%B4%E5%9C%B0%E5%85%B3%E9%97%AD%20_.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是盛延敏，这里是网络编程实战第11讲，欢迎回来。 上一讲我们讲到了TCP的四次挥手，其中发起连接关闭的一方会有一段时间处于TIME_WAIT状态。那么究竟如何来发起连接关闭呢？这一讲我们就来讨论一下。 我们知道，一个TCP连接需要经过三次握手进入数据传输阶段，最后来到连接关闭阶段。在最后的连接关闭阶段，我们需要重点关注的是“半连接”状态。 因为..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":12.89,"words":3868},"filePathRelative":"posts/网络编程实战/第二模块：提高篇/11 _ 优雅地关闭还是粗暴地关闭 _.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"11 | 优雅地关闭还是粗暴地关闭 ?\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/de/c2/de42764fa62843355aeb21af76ce1bc2.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第11讲，欢迎回来。</p>\\n<p>上一讲我们讲到了TCP的四次挥手，其中发起连接关闭的一方会有一段时间处于TIME_WAIT状态。那么究竟如何来发起连接关闭呢？这一讲我们就来讨论一下。</p>","autoDesc":true}');export{t as comp,v as data};
