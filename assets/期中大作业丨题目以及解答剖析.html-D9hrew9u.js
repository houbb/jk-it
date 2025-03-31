import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const p={};function l(d,n){return e(),a("div",null,n[0]||(n[0]=[i(`<p><audio id="audio" title="期中大作业丨题目以及解答剖析" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/e3/93/e36747798ad19a50a3d65a53165a8693.mp3"></audio></p><p>你好，今天是期中大作业讲解课。诚如一位同学所言，这次的大作业不是在考察网络编程的细节，而是在考如何使用系统API完成cd、pwd、ls等功能。不过呢，网络编程的框架总归还是要掌握的。</p><p>我研读了大部分同学的代码，基本上是做得不错的，美中不足的是能动手完成代码编写和调试的同学偏少。我还是秉持一贯的看法，计算机程序设计是一门实战性很强的学科，如果只是单纯地听讲解，没有自己动手这一环，对知识的掌握总归还是差那么点意思。</p><p>代码我已经push到<a href="https://github.com/froghui/yolanda/tree/master/mid-homework" target="_blank" rel="noopener noreferrer">这里</a>，你可以点进链接看一下。</p><h2 id="客户端程序" tabindex="-1"><a class="header-anchor" href="#客户端程序"><span>客户端程序</span></a></h2><p>废话少说，我贴下我的客户端程序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span>#define  MAXLINE     1024</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 3) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: tcp_client &amp;lt;IPaddress&amp;gt; &amp;lt;port&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int port = atoi(argv[2]);</span></span>
<span class="line"><span>    int socket_fd = tcp_client(argv[1], port);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char recv_line[MAXLINE], send_line[MAXLINE];</span></span>
<span class="line"><span>    int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fd_set readmask;</span></span>
<span class="line"><span>    fd_set allreads;</span></span>
<span class="line"><span>    FD_ZERO(&amp;amp;allreads);</span></span>
<span class="line"><span>    FD_SET(0, &amp;amp;allreads);</span></span>
<span class="line"><span>    FD_SET(socket_fd, &amp;amp;allreads);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        readmask = allreads;</span></span>
<span class="line"><span>        int rc = select(socket_fd + 1, &amp;amp;readmask, NULL, NULL, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (rc &amp;lt;= 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;select failed&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (FD_ISSET(socket_fd, &amp;amp;readmask)) {</span></span>
<span class="line"><span>            n = read(socket_fd, recv_line, MAXLINE);</span></span>
<span class="line"><span>            if (n &amp;lt; 0) {</span></span>
<span class="line"><span>                error(1, errno, &amp;quot;read error&amp;quot;);</span></span>
<span class="line"><span>            } else if (n == 0) {</span></span>
<span class="line"><span>                printf(&amp;quot;server closed \\n&amp;quot;);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            recv_line[n] = 0;</span></span>
<span class="line"><span>            fputs(recv_line, stdout);</span></span>
<span class="line"><span>            fputs(&amp;quot;\\n&amp;quot;, stdout);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (FD_ISSET(STDIN_FILENO, &amp;amp;readmask)) {</span></span>
<span class="line"><span>            if (fgets(send_line, MAXLINE, stdin) != NULL) {</span></span>
<span class="line"><span>                int i = strlen(send_line);</span></span>
<span class="line"><span>                if (send_line[i - 1] == &#39;\\n&#39;) {</span></span>
<span class="line"><span>                    send_line[i - 1] = 0;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if (strncmp(send_line, &amp;quot;quit&amp;quot;, strlen(send_line)) == 0) {</span></span>
<span class="line"><span>                    if (shutdown(socket_fd, 1)) {</span></span>
<span class="line"><span>                        error(1, errno, &amp;quot;shutdown failed&amp;quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                size_t rt = write(socket_fd, send_line, strlen(send_line));</span></span>
<span class="line"><span>                if (rt &amp;lt; 0) {</span></span>
<span class="line"><span>                    error(1, errno, &amp;quot;write failed &amp;quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端的代码主要考虑的是使用select同时处理标准输入和套接字，我看到有同学使用fgets来循环等待用户输入，然后再把输入的命令通过套接字发送出去，当然也是可以正常工作的，只不过不能及时响应来自服务端的命令结果，所以，我还是推荐使用select来同时处理标准输入和套接字。</p><p>这里select如果发现标准输入有事件，读出标准输入的字符，就会通过调用write方法发送出去。如果发现输入的是quit，则调用shutdown方法关闭连接的一端。</p><p>如果select发现套接字流有可读事件，则从套接字中读出数据，并把数据打印到标准输出上；如果读到了EOF，表示该客户端需要退出，直接退出循环，通过调用exit来完成进程的退出。</p><h2 id="服务器端程序" tabindex="-1"><a class="header-anchor" href="#服务器端程序"><span>服务器端程序</span></a></h2><p>下面是我写的服务器端程序：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span>static int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void sig_int(int signo) {</span></span>
<span class="line"><span>    printf(&amp;quot;\\nreceived %d datagrams\\n&amp;quot;, count);</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>char *run_cmd(char *cmd) {</span></span>
<span class="line"><span>    char *data = malloc(16384);</span></span>
<span class="line"><span>    bzero(data, sizeof(data));</span></span>
<span class="line"><span>    FILE *fdp;</span></span>
<span class="line"><span>    const int max_buffer = 256;</span></span>
<span class="line"><span>    char buffer[max_buffer];</span></span>
<span class="line"><span>    fdp = popen(cmd, &amp;quot;r&amp;quot;);</span></span>
<span class="line"><span>    char *data_index = data;</span></span>
<span class="line"><span>    if (fdp) {</span></span>
<span class="line"><span>        while (!feof(fdp)) {</span></span>
<span class="line"><span>            if (fgets(buffer, max_buffer, fdp) != NULL) {</span></span>
<span class="line"><span>                int len = strlen(buffer);</span></span>
<span class="line"><span>                memcpy(data_index, buffer, len);</span></span>
<span class="line"><span>                data_index += len;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        pclose(fdp);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return data;</span></span>
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
<span class="line"><span>    int on = 1;</span></span>
<span class="line"><span>    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &amp;amp;on, sizeof(on));</span></span>
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
<span class="line"><span>    signal(SIGPIPE, SIG_IGN);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int connfd;</span></span>
<span class="line"><span>    struct sockaddr_in client_addr;</span></span>
<span class="line"><span>    socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char buf[256];</span></span>
<span class="line"><span>    count = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        if ((connfd = accept(listenfd, (struct sockaddr *) &amp;amp;client_addr, &amp;amp;client_len)) &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;bind failed &amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (1) {</span></span>
<span class="line"><span>            bzero(buf, sizeof(buf));</span></span>
<span class="line"><span>            int n = read(connfd, buf, sizeof(buf));</span></span>
<span class="line"><span>            if (n &amp;lt; 0) {</span></span>
<span class="line"><span>                error(1, errno, &amp;quot;error read message&amp;quot;);</span></span>
<span class="line"><span>            } else if (n == 0) {</span></span>
<span class="line"><span>                printf(&amp;quot;client closed \\n&amp;quot;);</span></span>
<span class="line"><span>                close(connfd);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            count++;</span></span>
<span class="line"><span>            buf[n] = 0;</span></span>
<span class="line"><span>            if (strncmp(buf, &amp;quot;ls&amp;quot;, n) == 0) {</span></span>
<span class="line"><span>                char *result = run_cmd(&amp;quot;ls&amp;quot;);</span></span>
<span class="line"><span>                if (send(connfd, result, strlen(result), 0) &amp;lt; 0)</span></span>
<span class="line"><span>                    return 1;</span></span>
<span class="line"><span>            } else if (strncmp(buf, &amp;quot;pwd&amp;quot;, n) == 0) {</span></span>
<span class="line"><span>                char buf[256];</span></span>
<span class="line"><span>                char *result = getcwd(buf, 256);</span></span>
<span class="line"><span>                if (send(connfd, result, strlen(result), 0) &amp;lt; 0){</span></span>
<span class="line"><span>                    return 1;</span></span>
<span class="line"><span>                 }</span></span>
<span class="line"><span>                free(result);</span></span>
<span class="line"><span>            } else if (strncmp(buf, &amp;quot;cd &amp;quot;, 3) == 0) {</span></span>
<span class="line"><span>                char target[256];</span></span>
<span class="line"><span>                bzero(target, sizeof(target));</span></span>
<span class="line"><span>                memcpy(target, buf + 3, strlen(buf) - 3);</span></span>
<span class="line"><span>                if (chdir(target) == -1) {</span></span>
<span class="line"><span>                    printf(&amp;quot;change dir failed, %s\\n&amp;quot;, target);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                char *error = &amp;quot;error: unknown input type&amp;quot;;</span></span>
<span class="line"><span>                if (send(connfd, error, strlen(error), 0) &amp;lt; 0)</span></span>
<span class="line"><span>                    return 1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    exit(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务器端程序需要两层循环，第一层循环控制多个客户端连接，当然咱们这里没有考虑使用并发，这在第三个模块中会讲到。严格来说，现在的服务器端程序每次只能服务一个客户连接。</p><p>第二层循环控制和单个连接的数据交互，因为我们不止完成一次命令交互的过程，所以这一层循环也是必须的。</p><p>大部分同学都完成了这个两层循环的设计，我觉得非常棒。</p><p>在第一层循环里通过accept完成了连接的建立，获得连接套接字。</p><p>在第二层循环里，先通过调用read函数从套接字获取字节流。我这里处理的方式是反复使用了buf缓冲，每次使用之前记得都要调用bzero完成初始化，以便重复利用。</p><p>如果读取数据为0，则说明客户端尝试关闭连接，这种情况下，需要跳出第二层循环，进入accept阻塞调用，等待新的客户连接到来。我看到有同学使用了goto来完成跳转，其实使用break跳出就可以了，也有同学忘记跳转了，这里需要再仔细看一下。</p><p>在读出客户端的命令之后，就进入处理环节。通过字符串比较命令，进入不同的处理分支。C语言的strcmp或者strncmp可以帮助我们进行字符串比较，这个比较类似于Java语言的String equalsIgnoreCase方法。当然，如果命令的格式有错，需要我们把错误信息通过套接字传给客户端。</p><p>对于“pwd”命令，我是通过调用getcwd来完成的，getcwd是一个C语言的API，可以获得当前的路径。</p><p>对于“cd”命令，我是通过调用chdir来完成的，cd是一个C语言的API，可以将当前目录切换到指定的路径。有的同学在这里还判断支持了“cd ~”，回到了当前用户的HOME路径，这个非常棒，我就没有考虑这种情况了。</p><p>对于“ls”命令，我看到有同学是调用了scandir方法，获得当前路径下的所有文件列表，再根据每个文件类型，进行了格式化的输出。这个方法非常棒，是一个标准实现。我这里呢，为了显得稍微不一样，通过了popen的方法，执行了ls的bash命令，把bash命令的结果通过文件字节流的方式读出，再将该字节流通过套接字传给客户端。我看到有的同学在自己的程序里也是这么做的。</p><p>这次的期中大作业，主要考察了客户端-服务器编程的基础知识。</p><p>客户端程序考察使用select多路复用，一方面从标准输入接收字节流，另一方面通过套接字读写，以及使用shutdown关闭半连接的能力。</p><p>服务器端程序则考察套接字读写的能力，以及对端连接关闭情况下的异常处理等能力。</p><p>不过，服务器端程序目前只能一次服务一个客户端连接，不具备并发服务的能力。如何编写一个具备高并发服务能力的服务器端程序，将是我们接下来课程的重点。我们将会重点讲述基于I/O多路复用的事件驱动模型，并以此为基础设计一个高并发网络编程框架，通过这个框架，实现一个HTTP服务器。挑战和难度越来越高，你准备好了吗?</p>`,27)]))}const t=s(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E6%9C%9F%E4%B8%AD%E5%A4%8D%E4%B9%A0%E5%91%A8/%E6%9C%9F%E4%B8%AD%E5%A4%A7%E4%BD%9C%E4%B8%9A%E4%B8%A8%E9%A2%98%E7%9B%AE%E4%BB%A5%E5%8F%8A%E8%A7%A3%E7%AD%94%E5%89%96%E6%9E%90.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，今天是期中大作业讲解课。诚如一位同学所言，这次的大作业不是在考察网络编程的细节，而是在考如何使用系统API完成cd、pwd、ls等功能。不过呢，网络编程的框架总归还是要掌握的。 我研读了大部分同学的代码，基本上是做得不错的，美中不足的是能动手完成代码编写和调试的同学偏少。我还是秉持一贯的看法，计算机程序设计是一门实战性很强的学科，如果只是单纯地听...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E6%9C%9F%E4%B8%AD%E5%A4%8D%E4%B9%A0%E5%91%A8/%E6%9C%9F%E4%B8%AD%E5%A4%A7%E4%BD%9C%E4%B8%9A%E4%B8%A8%E9%A2%98%E7%9B%AE%E4%BB%A5%E5%8F%8A%E8%A7%A3%E7%AD%94%E5%89%96%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，今天是期中大作业讲解课。诚如一位同学所言，这次的大作业不是在考察网络编程的细节，而是在考如何使用系统API完成cd、pwd、ls等功能。不过呢，网络编程的框架总归还是要掌握的。 我研读了大部分同学的代码，基本上是做得不错的，美中不足的是能动手完成代码编写和调试的同学偏少。我还是秉持一贯的看法，计算机程序设计是一门实战性很强的学科，如果只是单纯地听..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":6.67,"words":2001},"filePathRelative":"posts/网络编程实战/期中复习周/期中大作业丨题目以及解答剖析.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"期中大作业丨题目以及解答剖析\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/e3/93/e36747798ad19a50a3d65a53165a8693.mp3\\"></audio></p>\\n<p>你好，今天是期中大作业讲解课。诚如一位同学所言，这次的大作业不是在考察网络编程的细节，而是在考如何使用系统API完成cd、pwd、ls等功能。不过呢，网络编程的框架总归还是要掌握的。</p>\\n<p>我研读了大部分同学的代码，基本上是做得不错的，美中不足的是能动手完成代码编写和调试的同学偏少。我还是秉持一贯的看法，计算机程序设计是一门实战性很强的学科，如果只是单纯地听讲解，没有自己动手这一环，对知识的掌握总归还是差那么点意思。</p>","autoDesc":true}');export{t as comp,v as data};
