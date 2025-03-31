import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="22 | 非阻塞I/O：提升性能的加速器" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/44/bc/44381bace6043f9a0bc1b5c4db6beebc.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第22讲，欢迎回来。</p><p>在性能篇的前两讲中，我分别介绍了select和poll两种不同的I/O多路复用技术。在接下来的这一讲中，我将带大家进入非阻塞I/O模式的世界。事实上，非阻塞I/O配合I/O多路复用，是高性能网络编程中的常见技术。</p><h2 id="阻塞-vs-非阻塞" tabindex="-1"><a class="header-anchor" href="#阻塞-vs-非阻塞"><span>阻塞 VS 非阻塞</span></a></h2><p>当应用程序调用阻塞I/O完成某个操作时，应用程序会被挂起，等待内核完成操作，感觉上应用程序像是被“阻塞”了一样。实际上，内核所做的事情是将CPU时间切换给其他有需要的进程，网络应用程序在这种情况下就会得不到CPU时间做该做的事情。</p><p>非阻塞I/O则不然，当应用程序调用非阻塞I/O完成某个操作时，内核立即返回，不会把CPU时间切换给其他进程，应用程序在返回后，可以得到足够的CPU时间继续完成其他事情。</p><p>如果拿去书店买书举例子，阻塞I/O对应什么场景呢？ 你去了书店，告诉老板（内核）你想要某本书，然后你就一直在那里等着，直到书店老板翻箱倒柜找到你想要的书，有可能还要帮你联系全城其它分店。注意，这个过程中你一直滞留在书店等待老板的回复，好像在书店老板这里&quot;阻塞&quot;住了。</p><p>那么非阻塞I/O呢？你去了书店，问老板有没你心仪的那本书，老板查了下电脑，告诉你没有，你就悻悻离开了。一周以后，你又来这个书店，再问这个老板，老板一查，有了，于是你买了这本书。注意，这个过程中，你没有被阻塞，而是在不断轮询。</p><p>但轮询的效率太低了，于是你向老板提议：“老板，到货给我打电话吧，我再来付钱取书。”这就是前面讲到的I/O多路复用。</p><p>再进一步，你连去书店取书也想省了，得了，让老板代劳吧，你留下地址，付了书费，让老板到货时寄给你，你直接在家里拿到就可以看了。这就是我们将会在第30讲中讲到的异步I/O。</p><p>这几个I/O模型，再加上进程、线程模型，构成了整个网络编程的知识核心。</p><p>按照使用场景，非阻塞I/O可以被用到读操作、写操作、接收连接操作和发起连接操作上。接下来，我们对它们一一解读。</p><h2 id="非阻塞i-o" tabindex="-1"><a class="header-anchor" href="#非阻塞i-o"><span>非阻塞I/O</span></a></h2><h3 id="读操作" tabindex="-1"><a class="header-anchor" href="#读操作"><span>读操作</span></a></h3><p>如果套接字对应的接收缓冲区没有数据可读，在非阻塞情况下read调用会立即返回，一般返回EWOULDBLOCK或EAGAIN出错信息。在这种情况下，出错信息是需要小心处理，比如后面再次调用read操作，而不是直接作为错误直接返回。这就好像去书店买书没买到离开一样，需要不断进行又一次轮询处理。</p><h3 id="写操作" tabindex="-1"><a class="header-anchor" href="#写操作"><span>写操作</span></a></h3><p>不知道你有没有注意到，在阻塞I/O情况下，write函数返回的字节数，和输入的参数总是一样的。如果返回值总是和输入的数据大小一样，write等写入函数还需要定义返回值吗？我不知道你是不是和我一样，刚接触到这一部分知识的时候有这种困惑。</p><p>这里就要引出我们所说的非阻塞I/O。在非阻塞I/O的情况下，如果套接字的发送缓冲区已达到了极限，不能容纳更多的字节，那么操作系统内核会<strong>尽最大可能</strong>从应用程序拷贝数据到发送缓冲区中，并立即从write等函数调用中返回。可想而知，在拷贝动作发生的瞬间，有可能一个字符也没拷贝，有可能所有请求字符都被拷贝完成，那么这个时候就需要返回一个数值，告诉应用程序到底有多少数据被成功拷贝到了发送缓冲区中，应用程序需要再次调用write函数，以输出未完成拷贝的字节。</p><p>write等函数是可以同时作用到阻塞I/O和非阻塞I/O上的，为了复用一个函数，处理非阻塞和阻塞I/O多种情况，设计出了写入返回值，并用这个返回值表示实际写入的数据大小。</p><p>也就是说，非阻塞I/O和阻塞I/O处理的方式是不一样的。</p><p>非阻塞I/O需要这样：拷贝→返回→再拷贝→再返回。</p><p>而阻塞I/O需要这样：拷贝→直到所有数据拷贝至发送缓冲区完成→返回。</p><p>不过在实战中，你可以不用区别阻塞和非阻塞I/O，使用循环的方式来写入数据就好了。只不过在阻塞I/O的情况下，循环只执行一次就结束了。</p><p>我在前面的章节中已经介绍了类似的方案，你可以看到writen函数的实现。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/* 向文件描述符fd写入n字节数 */</span></span>
<span class="line"><span>ssize_t writen(int fd, const void * data, size_t n)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    size_t      nleft;</span></span>
<span class="line"><span>    ssize_t     nwritten;</span></span>
<span class="line"><span>    const char  *ptr;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ptr = data;</span></span>
<span class="line"><span>    nleft = n;</span></span>
<span class="line"><span>    //如果还有数据没被拷贝完成，就一直循环</span></span>
<span class="line"><span>    while (nleft &amp;gt; 0) {</span></span>
<span class="line"><span>        if ( (nwritten = write(fd, ptr, nleft)) &amp;lt;= 0) {</span></span>
<span class="line"><span>           /* 这里EAGAIN是非阻塞non-blocking情况下，通知我们再次调用write() */</span></span>
<span class="line"><span>            if (nwritten &amp;lt; 0 &amp;amp;&amp;amp; errno == EAGAIN)</span></span>
<span class="line"><span>                nwritten = 0;      </span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                return -1;         /* 出错退出 */</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* 指针增大，剩下字节数变小*/</span></span>
<span class="line"><span>        nleft -= nwritten;</span></span>
<span class="line"><span>        ptr   += nwritten;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return n;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面我通过一张表来总结一下read和write在阻塞模式和非阻塞模式下的不同行为特性：</p><p><img src="https://static001.geekbang.org/resource/image/6e/aa/6e7a467bc6f5985eebbd94ef7de14aaa.png" alt=""><br><br> 关于read和write还有几个结论，你需要把握住：</p><ol><li>read总是在接收缓冲区有数据时就立即返回，不是等到应用程序给定的数据充满才返回。当接收缓冲区为空时，阻塞模式会等待，非阻塞模式立即返回-1，并有EWOULDBLOCK或EAGAIN错误。</li><li>和read不同，阻塞模式下，write只有在发送缓冲区足以容纳应用程序的输出字节时才返回；而非阻塞模式下，则是能写入多少就写入多少，并返回实际写入的字节数。</li><li>阻塞模式下的write有个特例, 就是对方主动关闭了套接字，这个时候write调用会立即返回，并通过返回值告诉应用程序实际写入的字节数，如果再次对这样的套接字进行write操作，就会返回失败。失败是通过返回值-1来通知到应用程序的。</li></ol><h3 id="accept" tabindex="-1"><a class="header-anchor" href="#accept"><span>accept</span></a></h3><p>当accept和I/O多路复用select、poll等一起配合使用时，如果在监听套接字上触发事件，说明有连接建立完成，此时调用accept肯定可以返回已连接套接字。这样看来，似乎把监听套接字设置为非阻塞，没有任何好处。</p><p>为了说明这个问题，我们构建一个客户端程序，其中最关键的是，一旦连接建立，设置SO_LINGER套接字选项，把l_onoff标志设置为1，把l_linger时间设置为0。这样，连接被关闭时，TCP套接字上将会发送一个RST。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct linger ling;</span></span>
<span class="line"><span>ling.l_onoff = 1; </span></span>
<span class="line"><span>ling.l_linger = 0;</span></span>
<span class="line"><span>setsockopt(socket_fd, SOL_SOCKET, SO_LINGER, &amp;amp;ling, sizeof(ling));</span></span>
<span class="line"><span>close(socket_fd);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务器端使用select I/O多路复用，不过，监听套接字仍然是blocking的。如果监听套接字上有事件发生，休眠5秒，以便模拟高并发场景下的情形。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>if (FD_ISSET(listen_fd, &amp;amp;readset)) {</span></span>
<span class="line"><span>    printf(&amp;quot;listening socket readable\\n&amp;quot;);</span></span>
<span class="line"><span>    sleep(5);</span></span>
<span class="line"><span>    struct sockaddr_storage ss;</span></span>
<span class="line"><span>    socklen_t slen = sizeof(ss);</span></span>
<span class="line"><span>    int fd = accept(listen_fd, (struct sockaddr *) &amp;amp;ss, &amp;amp;slen);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的休眠时间非常关键，这样，在监听套接字上有可读事件发生时，并没有马上调用accept。由于客户端发生了RST分节，该连接被接收端内核从自己的已完成队列中删除了，此时再调用accept，由于没有已完成连接（假设没有其他已完成连接），accept一直阻塞，更为严重的是，该线程再也没有机会对其他I/O事件进行分发，相当于该服务器无法对其他I/O进行服务。</p><p>如果我们将监听套接字设为非阻塞，上述的情形就不会再发生。只不过对于accept的返回值，需要正确地处理各种看似异常的错误，例如忽略EWOULDBLOCK、EAGAIN等。</p><p>这个例子给我们的启发是，一定要将监听套接字设置为非阻塞的，尽管这里休眠时间5秒有点夸张，但是在极端情况下处理不当的服务器程序是有可能碰到例子所阐述的情况，为了让服务器程序在极端情况下工作正常，这点工作还是非常值得的。</p><h3 id="connect" tabindex="-1"><a class="header-anchor" href="#connect"><span>connect</span></a></h3><p>在非阻塞TCP套接字上调用connect函数，会立即返回一个EINPROGRESS错误。TCP三次握手会正常进行，应用程序可以继续做其他初始化的事情。当该连接建立成功或者失败时，通过I/O多路复用select、poll等可以进行连接的状态检测。</p><h2 id="非阻塞i-o-select多路复用" tabindex="-1"><a class="header-anchor" href="#非阻塞i-o-select多路复用"><span>非阻塞I/O + select多路复用</span></a></h2><p>我在这里给出了一个非阻塞I/O搭配select多路复用的例子。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#define MAX_LINE 1024</span></span>
<span class="line"><span>#define FD_INIT_SIZE 128</span></span>
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
<span class="line"><span>//数据缓冲区</span></span>
<span class="line"><span>struct Buffer {</span></span>
<span class="line"><span>    int connect_fd;  //连接字</span></span>
<span class="line"><span>    char buffer[MAX_LINE];  //实际缓冲</span></span>
<span class="line"><span>    size_t writeIndex;      //缓冲写入位置</span></span>
<span class="line"><span>    size_t readIndex;       //缓冲读取位置</span></span>
<span class="line"><span>    int readable;           //是否可以读</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct Buffer *alloc_Buffer() {</span></span>
<span class="line"><span>    struct Buffer *buffer = malloc(sizeof(struct Buffer));</span></span>
<span class="line"><span>    if (!buffer)</span></span>
<span class="line"><span>        return NULL;</span></span>
<span class="line"><span>    buffer-&amp;gt;connect_fd = 0;</span></span>
<span class="line"><span>    buffer-&amp;gt;writeIndex = buffer-&amp;gt;readIndex = buffer-&amp;gt;readable = 0;</span></span>
<span class="line"><span>    return buffer;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void free_Buffer(struct Buffer *buffer) {</span></span>
<span class="line"><span>    free(buffer);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int onSocketRead(int fd, struct Buffer *buffer) {</span></span>
<span class="line"><span>    char buf[1024];</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    ssize_t result;</span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        result = recv(fd, buf, sizeof(buf), 0);</span></span>
<span class="line"><span>        if (result &amp;lt;= 0)</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; result; ++i) {</span></span>
<span class="line"><span>            if (buffer-&amp;gt;writeIndex &amp;lt; sizeof(buffer-&amp;gt;buffer))</span></span>
<span class="line"><span>                buffer-&amp;gt;buffer[buffer-&amp;gt;writeIndex++] = rot13_char(buf[i]);</span></span>
<span class="line"><span>            if (buf[i] == &#39;\\n&#39;) {</span></span>
<span class="line"><span>                buffer-&amp;gt;readable = 1;  //缓冲区可以读</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (result == 0) {</span></span>
<span class="line"><span>        return 1;</span></span>
<span class="line"><span>    } else if (result &amp;lt; 0) {</span></span>
<span class="line"><span>        if (errno == EAGAIN)</span></span>
<span class="line"><span>            return 0;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int onSocketWrite(int fd, struct Buffer *buffer) {</span></span>
<span class="line"><span>    while (buffer-&amp;gt;readIndex &amp;lt; buffer-&amp;gt;writeIndex) {</span></span>
<span class="line"><span>        ssize_t result = send(fd, buffer-&amp;gt;buffer + buffer-&amp;gt;readIndex, buffer-&amp;gt;writeIndex - buffer-&amp;gt;readIndex, 0);</span></span>
<span class="line"><span>        if (result &amp;lt; 0) {</span></span>
<span class="line"><span>            if (errno == EAGAIN)</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        buffer-&amp;gt;readIndex += result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (buffer-&amp;gt;readIndex == buffer-&amp;gt;writeIndex)</span></span>
<span class="line"><span>        buffer-&amp;gt;readIndex = buffer-&amp;gt;writeIndex = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    buffer-&amp;gt;readable = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listen_fd;</span></span>
<span class="line"><span>    int i, maxfd;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct Buffer *buffer[FD_INIT_SIZE];</span></span>
<span class="line"><span>    for (i = 0; i &amp;lt; FD_INIT_SIZE; ++i) {</span></span>
<span class="line"><span>        buffer[i] = alloc_Buffer();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    listen_fd = tcp_nonblocking_server_listen(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fd_set readset, writeset, exset;</span></span>
<span class="line"><span>    FD_ZERO(&amp;amp;readset);</span></span>
<span class="line"><span>    FD_ZERO(&amp;amp;writeset);</span></span>
<span class="line"><span>    FD_ZERO(&amp;amp;exset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        maxfd = listen_fd;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        FD_ZERO(&amp;amp;readset);</span></span>
<span class="line"><span>        FD_ZERO(&amp;amp;writeset);</span></span>
<span class="line"><span>        FD_ZERO(&amp;amp;exset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // listener加入readset</span></span>
<span class="line"><span>        FD_SET(listen_fd, &amp;amp;readset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; FD_INIT_SIZE; ++i) {</span></span>
<span class="line"><span>            if (buffer[i]-&amp;gt;connect_fd &amp;gt; 0) {</span></span>
<span class="line"><span>                if (buffer[i]-&amp;gt;connect_fd &amp;gt; maxfd)</span></span>
<span class="line"><span>                    maxfd = buffer[i]-&amp;gt;connect_fd;</span></span>
<span class="line"><span>                FD_SET(buffer[i]-&amp;gt;connect_fd, &amp;amp;readset);</span></span>
<span class="line"><span>                if (buffer[i]-&amp;gt;readable) {</span></span>
<span class="line"><span>                    FD_SET(buffer[i]-&amp;gt;connect_fd, &amp;amp;writeset);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (select(maxfd + 1, &amp;amp;readset, &amp;amp;writeset, &amp;amp;exset, NULL) &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;select error&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (FD_ISSET(listen_fd, &amp;amp;readset)) {</span></span>
<span class="line"><span>            printf(&amp;quot;listening socket readable\\n&amp;quot;);</span></span>
<span class="line"><span>            sleep(5);</span></span>
<span class="line"><span>            struct sockaddr_storage ss;</span></span>
<span class="line"><span>            socklen_t slen = sizeof(ss);</span></span>
<span class="line"><span>           int fd = accept(listen_fd, (struct sockaddr *) &amp;amp;ss, &amp;amp;slen);</span></span>
<span class="line"><span>            if (fd &amp;lt; 0) {</span></span>
<span class="line"><span>                error(1, errno, &amp;quot;accept failed&amp;quot;);</span></span>
<span class="line"><span>            } else if (fd &amp;gt; FD_INIT_SIZE) {</span></span>
<span class="line"><span>                error(1, 0, &amp;quot;too many connections&amp;quot;);</span></span>
<span class="line"><span>                close(fd);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                make_nonblocking(fd);</span></span>
<span class="line"><span>                if (buffer[fd]-&amp;gt;connect_fd == 0) {</span></span>
<span class="line"><span>                    buffer[fd]-&amp;gt;connect_fd = fd;</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    error(1, 0, &amp;quot;too many connections&amp;quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; maxfd + 1; ++i) {</span></span>
<span class="line"><span>            int r = 0;</span></span>
<span class="line"><span>            if (i == listen_fd)</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (FD_ISSET(i, &amp;amp;readset)) {</span></span>
<span class="line"><span>                r = onSocketRead(i, buffer[i]);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (r == 0 &amp;amp;&amp;amp; FD_ISSET(i, &amp;amp;writeset)) {</span></span>
<span class="line"><span>                r = onSocketWrite(i, buffer[i]);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (r) {</span></span>
<span class="line"><span>                buffer[i]-&amp;gt;connect_fd = 0;</span></span>
<span class="line"><span>                close(i);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第93行，调用fcntl将监听套接字设置为非阻塞。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>fcntl(fd, F_SETFL, O_NONBLOCK);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>第121行调用select进行I/O事件分发处理。</p><p>131-142行在处理新的连接套接字，注意这里也把连接套接字设置为非阻塞的。</p><p>151-156行在处理连接套接字上的I/O读写事件，这里我们抽象了一个Buffer对象，Buffer对象使用了readIndex和writeIndex分别表示当前缓冲的读写位置。</p><h2 id="实验" tabindex="-1"><a class="header-anchor" href="#实验"><span>实验</span></a></h2><p>启动该服务器：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./nonblockingserver</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>使用多个telnet客户端连接该服务器，可以验证交互正常。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to localhost.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>fasfasfasf</span></span>
<span class="line"><span>snfsnfsnfs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>非阻塞I/O可以使用在read、write、accept、connect等多种不同的场景，在非阻塞I/O下，使用轮询的方式引起CPU占用率高，所以一般将非阻塞I/O和I/O多路复用技术select、poll等搭配使用，在非阻塞I/O事件发生时，再调用对应事件的处理函数。这种方式，极大地提高了程序的健壮性和稳定性，是Linux下高性能网络编程的首选。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>给你布置两道思考题:</p><p>第一道，程序中第133行这个判断说明了什么？如果要改进的话，你有什么想法？</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>else if (fd &amp;gt; FD_INIT_SIZE) {</span></span>
<span class="line"><span>    error(1, 0, &amp;quot;too many connections&amp;quot;);</span></span>
<span class="line"><span>    close(fd);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二道，你可以仔细阅读一下数据读写部分Buffer的代码，你觉得用一个Buffer对象，而不是两个的目的是什么？</p><p>欢迎在评论区写下你的思考，我会和你一起交流，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,60)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/22%20_%20%E9%9D%9E%E9%98%BB%E5%A1%9EI_O%EF%BC%9A%E6%8F%90%E5%8D%87%E6%80%A7%E8%83%BD%E7%9A%84%E5%8A%A0%E9%80%9F%E5%99%A8.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是盛延敏，这里是网络编程实战第22讲，欢迎回来。 在性能篇的前两讲中，我分别介绍了select和poll两种不同的I/O多路复用技术。在接下来的这一讲中，我将带大家进入非阻塞I/O模式的世界。事实上，非阻塞I/O配合I/O多路复用，是高性能网络编程中的常见技术。 阻塞 VS 非阻塞 当应用程序调用阻塞I/O完成某个操作时，应用程序会被挂起，等待...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/22%20_%20%E9%9D%9E%E9%98%BB%E5%A1%9EI_O%EF%BC%9A%E6%8F%90%E5%8D%87%E6%80%A7%E8%83%BD%E7%9A%84%E5%8A%A0%E9%80%9F%E5%99%A8.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是盛延敏，这里是网络编程实战第22讲，欢迎回来。 在性能篇的前两讲中，我分别介绍了select和poll两种不同的I/O多路复用技术。在接下来的这一讲中，我将带大家进入非阻塞I/O模式的世界。事实上，非阻塞I/O配合I/O多路复用，是高性能网络编程中的常见技术。 阻塞 VS 非阻塞 当应用程序调用阻塞I/O完成某个操作时，应用程序会被挂起，等待..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":11.46,"words":3438},"filePathRelative":"posts/网络编程实战/第三模块：性能篇/22 _ 非阻塞I_O：提升性能的加速器.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"22 | 非阻塞I/O：提升性能的加速器\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/44/bc/44381bace6043f9a0bc1b5c4db6beebc.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第22讲，欢迎回来。</p>\\n<p>在性能篇的前两讲中，我分别介绍了select和poll两种不同的I/O多路复用技术。在接下来的这一讲中，我将带大家进入非阻塞I/O模式的世界。事实上，非阻塞I/O配合I/O多路复用，是高性能网络编程中的常见技术。</p>","autoDesc":true}');export{t as comp,v as data};
