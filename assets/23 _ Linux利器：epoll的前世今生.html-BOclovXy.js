import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,a,o as i}from"./app-CrA-f6So.js";const l={};function p(d,s){return i(),e("div",null,s[0]||(s[0]=[a(`<h1 id="_23-linux利器-epoll的前世今生" tabindex="-1"><a class="header-anchor" href="#_23-linux利器-epoll的前世今生"><span>23 _ Linux利器：epoll的前世今生</span></a></h1><p><audio id="audio" title="23 | Linux利器：epoll的前世今生" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/48/6c/4820058629fb5514b1736a629b9fdd6c.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第23讲，欢迎回来。</p><p>性能篇的前三讲，非阻塞I/O加上I/O多路复用，已经渐渐帮助我们在高性能网络编程这个领域搭建了初步的基石。但是，离最终的目标还差那么一点，如果说I/O多路复用帮我们打开了高性能网络编程的窗口，那么今天的主题——epoll，将为我们增添足够的动力。</p><p>这里有放置了一张图，这张图来自The Linux Programming Interface(No Starch Press)。这张图直观地为我们展示了select、poll、epoll几种不同的I/O复用技术在面对不同文件描述符大小时的表现差异。</p><p><img src="https://static001.geekbang.org/resource/image/fd/60/fd2e25f72a5103ef78c05c7ad2dab060.png" alt=""><br><br> 从图中可以明显地看到，epoll的性能是最好的，即使在多达10000个文件描述的情况下，其性能的下降和有10个文件描述符的情况相比，差别也不是很大。而随着文件描述符的增大，常规的select和poll方法性能逐渐变得很差。</p><p>那么，epoll究竟使用了什么样的“魔法”，取得了如此令人惊讶的效果呢？接下来，我们就来一起分析一下。</p><h2 id="epoll的用法" tabindex="-1"><a class="header-anchor" href="#epoll的用法"><span>epoll的用法</span></a></h2><p>在分析对比epoll、poll和select几种技术之前，我们先看一下怎么使用epoll来完成一个服务器程序，具体的原理我将在29讲中进行讲解。</p><p>epoll可以说是和poll非常相似的一种I/O多路复用技术，有些朋友将epoll归为异步I/O，我觉得这是不正确的。本质上epoll还是一种I/O多路复用技术， epoll通过监控注册的多个描述字，来进行I/O事件的分发处理。不同于poll的是，epoll不仅提供了默认的level-triggered（条件触发）机制，还提供了性能更为强劲的edge-triggered（边缘触发）机制。至于这两种机制的区别，我会在后面详细展开。</p><p>使用epoll进行网络程序的编写，需要三个步骤，分别是epoll_create，epoll_ctl和epoll_wait。接下来我对这几个API详细展开讲一下。</p><h3 id="epoll-create" tabindex="-1"><a class="header-anchor" href="#epoll-create"><span>epoll_create</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int epoll_create(int size);</span></span>
<span class="line"><span>int epoll_create1(int flags);</span></span>
<span class="line"><span>        返回值: 若成功返回一个大于0的值，表示epoll实例；若返回-1表示出错</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>epoll_create()方法创建了一个epoll实例，从Linux 2.6.8开始，参数size被自动忽略，但是该值仍需要一个大于0的整数。这个epoll实例被用来调用epoll_ctl和epoll_wait，如果这个epoll实例不再需要，比如服务器正常关机，需要调用close()方法释放epoll实例，这样系统内核可以回收epoll实例所分配使用的内核资源。</p><p>关于这个参数size，在一开始的epoll_create实现中，是用来告知内核期望监控的文件描述字大小，然后内核使用这部分的信息来初始化内核数据结构，在新的实现中，这个参数不再被需要，因为内核可以动态分配需要的内核数据结构。我们只需要注意，每次将size设置成一个大于0的整数就可以了。</p><p>epoll_create1()的用法和epoll_create()基本一致，如果epoll_create1()的输入flags为0，则和epoll_create()一样，内核自动忽略。可以增加如EPOLL_CLOEXEC的额外选项，如果你有兴趣的话，可以研究一下这个选项有什么意义。</p><h3 id="epoll-ctl" tabindex="-1"><a class="header-anchor" href="#epoll-ctl"><span>epoll_ctl</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);</span></span>
<span class="line"><span>        返回值: 若成功返回0；若返回-1表示出错</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>在创建完epoll实例之后，可以通过调用epoll_ctl往这个epoll实例增加或删除监控的事件。函数epll_ctl有4个入口参数。</p><p>第一个参数epfd是刚刚调用epoll_create创建的epoll实例描述字，可以简单理解成是epoll句柄。</p><p>第二个参数表示增加还是删除一个监控事件，它有三个选项可供选择：</p><ul><li>EPOLL_CTL_ADD： 向epoll实例注册文件描述符对应的事件；</li><li>EPOLL_CTL_DEL：向epoll实例删除文件描述符对应的事件；</li><li>EPOLL_CTL_MOD： 修改文件描述符对应的事件。</li></ul><p>第三个参数是注册的事件的文件描述符，比如一个监听套接字。</p><p>第四个参数表示的是注册的事件类型，并且可以在这个结构体里设置用户需要的数据，其中最为常见的是使用联合结构里的fd字段，表示事件所对应的文件描述符。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>typedef union epoll_data {</span></span>
<span class="line"><span>     void        *ptr;</span></span>
<span class="line"><span>     int          fd;</span></span>
<span class="line"><span>     uint32_t     u32;</span></span>
<span class="line"><span>     uint64_t     u64;</span></span>
<span class="line"><span> } epoll_data_t;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> struct epoll_event {</span></span>
<span class="line"><span>     uint32_t     events;      /* Epoll events */</span></span>
<span class="line"><span>     epoll_data_t data;        /* User data variable */</span></span>
<span class="line"><span> };</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们在前面介绍poll的时候已经接触过基于mask的事件类型了，这里epoll仍旧使用了同样的机制，我们重点看一下这几种事件类型：</p><ul><li>EPOLLIN：表示对应的文件描述字可以读；</li><li>EPOLLOUT：表示对应的文件描述字可以写；</li><li>EPOLLRDHUP：表示套接字的一端已经关闭，或者半关闭；</li><li>EPOLLHUP：表示对应的文件描述字被挂起；</li><li>EPOLLET：设置为edge-triggered，默认为level-triggered。</li></ul><h3 id="epoll-wait" tabindex="-1"><a class="header-anchor" href="#epoll-wait"><span>epoll_wait</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout);</span></span>
<span class="line"><span>  返回值: 成功返回的是一个大于0的数，表示事件的个数；返回0表示的是超时时间到；若出错返回-1.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>epoll_wait()函数类似之前的poll和select函数，调用者进程被挂起，在等待内核I/O事件的分发。</p><p>这个函数的第一个参数是epoll实例描述字，也就是epoll句柄。</p><p>第二个参数返回给用户空间需要处理的I/O事件，这是一个数组，数组的大小由epoll_wait的返回值决定，这个数组的每个元素都是一个需要待处理的I/O事件，其中events表示具体的事件类型，事件类型取值和epoll_ctl可设置的值一样，这个epoll_event结构体里的data值就是在epoll_ctl那里设置的data，也就是用户空间和内核空间调用时需要的数据。</p><p>第三个参数是一个大于0的整数，表示epoll_wait可以返回的最大事件值。</p><p>第四个参数是epoll_wait阻塞调用的超时值，如果这个值设置为-1，表示不超时；如果设置为0则立即返回，即使没有任何I/O事件发生。</p><h2 id="epoll例子" tabindex="-1"><a class="header-anchor" href="#epoll例子"><span>epoll例子</span></a></h2><h3 id="代码解析" tabindex="-1"><a class="header-anchor" href="#代码解析"><span>代码解析</span></a></h3><p>下面我们把原先基于poll的服务器端程序改造成基于epoll的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define MAXEVENTS 128</span></span>
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
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    int listen_fd, socket_fd;</span></span>
<span class="line"><span>    int n, i;</span></span>
<span class="line"><span>    int efd;</span></span>
<span class="line"><span>    struct epoll_event event;</span></span>
<span class="line"><span>    struct epoll_event *events;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    listen_fd = tcp_nonblocking_server_listen(SERV_PORT);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    efd = epoll_create1(0);</span></span>
<span class="line"><span>    if (efd == -1) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;epoll create failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    event.data.fd = listen_fd;</span></span>
<span class="line"><span>    event.events = EPOLLIN | EPOLLET;</span></span>
<span class="line"><span>    if (epoll_ctl(efd, EPOLL_CTL_ADD, listen_fd, &amp;amp;event) == -1) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;epoll_ctl add listen fd failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Buffer where events are returned */</span></span>
<span class="line"><span>    events = calloc(MAXEVENTS, sizeof(event));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (1) {</span></span>
<span class="line"><span>        n = epoll_wait(efd, events, MAXEVENTS, -1);</span></span>
<span class="line"><span>        printf(&amp;quot;epoll_wait wakeup\\n&amp;quot;);</span></span>
<span class="line"><span>        for (i = 0; i &amp;lt; n; i++) {</span></span>
<span class="line"><span>            if ((events[i].events &amp;amp; EPOLLERR) ||</span></span>
<span class="line"><span>                (events[i].events &amp;amp; EPOLLHUP) ||</span></span>
<span class="line"><span>                (!(events[i].events &amp;amp; EPOLLIN))) {</span></span>
<span class="line"><span>                fprintf(stderr, &amp;quot;epoll error\\n&amp;quot;);</span></span>
<span class="line"><span>                close(events[i].data.fd);</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            } else if (listen_fd == events[i].data.fd) {</span></span>
<span class="line"><span>                struct sockaddr_storage ss;</span></span>
<span class="line"><span>                socklen_t slen = sizeof(ss);</span></span>
<span class="line"><span>                int fd = accept(listen_fd, (struct sockaddr *) &amp;amp;ss, &amp;amp;slen);</span></span>
<span class="line"><span>                if (fd &amp;lt; 0) {</span></span>
<span class="line"><span>                    error(1, errno, &amp;quot;accept failed&amp;quot;);</span></span>
<span class="line"><span>                } else {</span></span>
<span class="line"><span>                    make_nonblocking(fd);</span></span>
<span class="line"><span>                    event.data.fd = fd;</span></span>
<span class="line"><span>                    event.events = EPOLLIN | EPOLLET; //edge-triggered</span></span>
<span class="line"><span>                    if (epoll_ctl(efd, EPOLL_CTL_ADD, fd, &amp;amp;event) == -1) {</span></span>
<span class="line"><span>                        error(1, errno, &amp;quot;epoll_ctl add connection fd failed&amp;quot;);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                socket_fd = events[i].data.fd;</span></span>
<span class="line"><span>                printf(&amp;quot;get event on socket fd == %d \\n&amp;quot;, socket_fd);</span></span>
<span class="line"><span>                while (1) {</span></span>
<span class="line"><span>                    char buf[512];</span></span>
<span class="line"><span>                    if ((n = read(socket_fd, buf, sizeof(buf))) &amp;lt; 0) {</span></span>
<span class="line"><span>                        if (errno != EAGAIN) {</span></span>
<span class="line"><span>                            error(1, errno, &amp;quot;read error&amp;quot;);</span></span>
<span class="line"><span>                            close(socket_fd);</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    } else if (n == 0) {</span></span>
<span class="line"><span>                        close(socket_fd);</span></span>
<span class="line"><span>                        break;</span></span>
<span class="line"><span>                    } else {</span></span>
<span class="line"><span>                        for (i = 0; i &amp;lt; n; ++i) {</span></span>
<span class="line"><span>                            buf[i] = rot13_char(buf[i]);</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        if (write(socket_fd, buf, n) &amp;lt; 0) {</span></span>
<span class="line"><span>                            error(1, errno, &amp;quot;write error&amp;quot;);</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    free(events);</span></span>
<span class="line"><span>    close(listen_fd);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>程序的第23行调用epoll_create0创建了一个epoll实例。</p><p>28-32行，调用epoll_ctl将监听套接字对应的I/O事件进行了注册，这样在有新的连接建立之后，就可以感知到。注意这里使用的是edge-triggered（边缘触发）。</p><p>35行为返回的event数组分配了内存。</p><p>主循环调用epoll_wait函数分发I/O事件，当epoll_wait成功返回时，通过遍历返回的event数组，就直接可以知道发生的I/O事件。</p><p>第41-46行判断了各种错误情况。</p><p>第47-61行是监听套接字上有事件发生的情况下，调用accept获取已建立连接，并将该连接设置为非阻塞，再调用epoll_ctl把已连接套接字对应的可读事件注册到epoll实例中。这里我们使用了event_data里面的fd字段，将连接套接字存储其中。</p><p>第63-84行，处理了已连接套接字上的可读事件，读取字节流，编码后再回应给客户端。</p><h3 id="实验" tabindex="-1"><a class="header-anchor" href="#实验"><span>实验</span></a></h3><p>启动该服务器：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./epoll01</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 6</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 6</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 6</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 6</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再启动几个telnet客户端，可以看到有连接建立情况下，epoll_wait迅速从挂起状态结束；并且套接字上有数据可读时，epoll_wait也迅速结束挂起状态，这时候通过read可以读取套接字接收缓冲区上的数据。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to 127.0.0.1.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>fasfsafas</span></span>
<span class="line"><span>snfsfnsnf</span></span>
<span class="line"><span>^]</span></span>
<span class="line"><span>telnet&amp;gt; quit</span></span>
<span class="line"><span>Connection closed.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="edge-triggered-vs-level-triggered" tabindex="-1"><a class="header-anchor" href="#edge-triggered-vs-level-triggered"><span>edge-triggered VS level-triggered</span></a></h2><p>对于edge-triggered和level-triggered， 官方的说法是一个是边缘触发，一个是条件触发。也有文章从电子脉冲角度来解读的，总体上，给初学者的带来的感受是理解上有困难。</p><p>这里有两个程序，我们用这个程序来说明一下这两者之间的不同。</p><p>在这两个程序里，即使已连接套接字上有数据可读，我们也不调用read函数去读，只是简单地打印出一句话。</p><p>第一个程序我们设置为edge-triggered，即边缘触发。开启这个服务器程序，用telnet连接上，输入一些字符，我们看到，服务器端只从epoll_wait中苏醒过一次，就是第一次有数据可读的时候。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./epoll02</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$telnet 127.0.0.1 43211</span></span>
<span class="line"><span>Trying 127.0.0.1...</span></span>
<span class="line"><span>Connected to 127.0.0.1.</span></span>
<span class="line"><span>Escape character is &#39;^]&#39;.</span></span>
<span class="line"><span>asfafas</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二个程序我们设置为level-triggered，即条件触发。然后按照同样的步骤来一次，观察服务器端，这一次我们可以看到，服务器端不断地从epoll_wait中苏醒，告诉我们有数据需要读取。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./epoll03</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span>
<span class="line"><span>epoll_wait wakeup</span></span>
<span class="line"><span>get event on socket fd == 5</span></span>
<span class="line"><span>...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就是两者的区别，条件触发的意思是只要满足事件的条件，比如有数据需要读，就一直不断地把这个事件传递给用户；而边缘触发的意思是只有第一次满足条件的时候才触发，之后就不会再传递同样的事件了。</p><p>一般我们认为，边缘触发的效率比条件触发的效率要高，这一点也是epoll的杀手锏之一。</p><h2 id="epoll的历史" tabindex="-1"><a class="header-anchor" href="#epoll的历史"><span>epoll的历史</span></a></h2><p>早在Linux实现epoll之前，Windows系统就已经在1994年引入了IOCP，这是一个异步I/O模型，用来支持高并发的网络I/O，而著名的FreeBSD在2000年引入了Kqueue——一个I/O事件分发框架。</p><p>Linux在2002年引入了epoll，不过相关工作的讨论和设计早在2000年就开始了。如果你感兴趣的话，可以[<a href="http://lkml.iu.edu/hypermail/linux/kernel/0010.3/0003.html" target="_blank" rel="noopener noreferrer">http://lkml.iu.edu/hypermail/linux/kernel/0010.3/0003.html</a>](http:// &lt;a href=)&quot;&gt;点击这里看一下里面的讨论。</p><p>为什么Linux不把FreeBSD的kqueue直接移植过来，而是另辟蹊径创立了epoll呢？</p><p>让我们先看下kqueue的用法，kqueue也需要先创建一个名叫kqueue的对象，然后通过这个对象，调用kevent函数增加感兴趣的事件，同时，也是通过这个kevent函数来等待事件的发生。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int kqueue(void);</span></span>
<span class="line"><span>int kevent(int kq, const struct kevent *changelist, int nchanges,</span></span>
<span class="line"><span>　　　　　 struct kevent *eventlist, int nevents,</span></span>
<span class="line"><span>　　　　　 const struct timespec *timeout);</span></span>
<span class="line"><span>void EV_SET(struct kevent *kev, uintptr_t ident, short filter,</span></span>
<span class="line"><span>　　　　　　u_short flags, u_int fflags, intptr_t data, void *udata);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct kevent {</span></span>
<span class="line"><span>　uintptr_t　ident;　　　/* identifier (e.g., file descriptor) */</span></span>
<span class="line"><span>　short　　　 filter;　　/* filter type (e.g., EVFILT_READ) */</span></span>
<span class="line"><span>　u_short　　 flags;　　　/* action flags (e.g., EV_ADD) */</span></span>
<span class="line"><span>　u_int　　　　fflags;　　/* filter-specific flags */</span></span>
<span class="line"><span>　intptr_t　　 data;　　　/* filter-specific data */</span></span>
<span class="line"><span>　void　　　　 *udata;　　 /* opaque user data */</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Linus在他最初的设想里，提到了这么一句话，也就是说他觉得类似select或poll的数组方式是可以的，而队列方式则是不可取的。</p><p>So sticky arrays of events are good, while queues are bad. Let’s take that as one of the fundamentals.</p><p>在最初的设计里，Linus等于把keque里面的kevent函数拆分了两个部分，一部分负责事件绑定，通过bind_event函数来实现；另一部分负责事件等待，通过get_events来实现。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct event {</span></span>
<span class="line"><span>     unsigned long id; /* file descriptor ID the event is on */</span></span>
<span class="line"><span>     unsigned long event; /* bitmask of active events */</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int bind_event(int fd, struct event *event);</span></span>
<span class="line"><span>int get_events(struct event * event_array, int maxnr, struct timeval *tmout);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和最终的epoll实现相比，前者类似epoll_ctl，后者类似epoll_wait，不过原始的设计里没有考虑到创建epoll句柄，在最终的实现里增加了epoll_create，支持了epoll句柄的创建。</p><p>2002年，epoll最终在Linux 2.5.44中首次出现，在2.6中趋于稳定，为Linux的高性能网络I/O画上了一段句号。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>Linux中epoll的出现，为高性能网络编程补齐了最后一块拼图。epoll通过改进的接口设计，避免了用户态-内核态频繁的数据拷贝，大大提高了系统性能。在使用epoll的时候，我们一定要理解条件触发和边缘触发两种模式。条件触发的意思是只要满足事件的条件，比如有数据需要读，就一直不断地把这个事件传递给用户；而边缘触发的意思是只有第一次满足条件的时候才触发，之后就不会再传递同样的事件了。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>理解完了epoll，和往常一样，我给你布置两道思考题：</p><p>第一道，你不妨试着修改一下第20讲中select的例子，即在已连接套接字上有数据可读，也不调用read函数去读，看一看你的结果，你认为select是边缘触发的，还是条件触发的？</p><p>第二道，同样的修改一下第21讲poll的例子，看看你的结果，你认为poll是边缘触发的，还是条件触发的？</p><p>你可以在GitHub上上传你的代码，并写出你的疑惑，我会和你一起交流，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,80)]))}const r=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/23%20_%20Linux%E5%88%A9%E5%99%A8%EF%BC%9Aepoll%E7%9A%84%E5%89%8D%E4%B8%96%E4%BB%8A%E7%94%9F.html","title":"23 _ Linux利器：epoll的前世今生","lang":"zh-CN","frontmatter":{"description":"23 _ Linux利器：epoll的前世今生 你好，我是盛延敏，这里是网络编程实战第23讲，欢迎回来。 性能篇的前三讲，非阻塞I/O加上I/O多路复用，已经渐渐帮助我们在高性能网络编程这个领域搭建了初步的基石。但是，离最终的目标还差那么一点，如果说I/O多路复用帮我们打开了高性能网络编程的窗口，那么今天的主题——epoll，将为我们增添足够的动力。 ...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/23%20_%20Linux%E5%88%A9%E5%99%A8%EF%BC%9Aepoll%E7%9A%84%E5%89%8D%E4%B8%96%E4%BB%8A%E7%94%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"23 _ Linux利器：epoll的前世今生"}],["meta",{"property":"og:description","content":"23 _ Linux利器：epoll的前世今生 你好，我是盛延敏，这里是网络编程实战第23讲，欢迎回来。 性能篇的前三讲，非阻塞I/O加上I/O多路复用，已经渐渐帮助我们在高性能网络编程这个领域搭建了初步的基石。但是，离最终的目标还差那么一点，如果说I/O多路复用帮我们打开了高性能网络编程的窗口，那么今天的主题——epoll，将为我们增添足够的动力。 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"23 _ Linux利器：epoll的前世今生\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":12.66,"words":3798},"filePathRelative":"posts/网络编程实战/第三模块：性能篇/23 _ Linux利器：epoll的前世今生.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"23 | Linux利器：epoll的前世今生\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/48/6c/4820058629fb5514b1736a629b9fdd6c.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第23讲，欢迎回来。</p>\\n<p>性能篇的前三讲，非阻塞I/O加上I/O多路复用，已经渐渐帮助我们在高性能网络编程这个领域搭建了初步的基石。但是，离最终的目标还差那么一点，如果说I/O多路复用帮我们打开了高性能网络编程的窗口，那么今天的主题——epoll，将为我们增添足够的动力。</p>","autoDesc":true}');export{r as comp,v as data};
