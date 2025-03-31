import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const p={};function l(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_12-连接无效-使用keep-alive还是应用心跳来检测" tabindex="-1"><a class="header-anchor" href="#_12-连接无效-使用keep-alive还是应用心跳来检测"><span>12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？</span></a></h1><p><audio id="audio" title="12 | 连接无效：使用Keep-Alive还是应用心跳来检测？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/58/60/586941b4a8a67086dc4151bf00541d60.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第12讲，欢迎回来。</p><p>上一篇文章中，我们讲到了如何使用close和shutdown来完成连接的关闭，在大多数情况下，我们会优选shutdown来完成对连接一个方向的关闭，待对端处理完之后，再完成另外一个方向的关闭。</p><p>在很多情况下，连接的一端需要一直感知连接的状态，如果连接无效了，应用程序可能需要报错，或者重新发起连接等。</p><p>在这一篇文章中，我将带你体验一下对连接状态的检测，并提供检测连接状态的最佳实践。</p><h2 id="从一个例子开始" tabindex="-1"><a class="header-anchor" href="#从一个例子开始"><span>从一个例子开始</span></a></h2><p>让我们用一个例子开始今天的话题。</p><p>我之前做过一个基于NATS消息系统的项目，多个消息的提供者 （pub）和订阅者（sub）都连到NATS消息系统，通过这个系统来完成消息的投递和订阅处理。</p><p>突然有一天，线上报了一个故障，一个流程不能正常处理。经排查，发现消息正确地投递到了NATS服务端，但是消息订阅者没有收到该消息，也没能做出处理，导致流程没能进行下去。</p><p>通过观察消息订阅者后发现，消息订阅者到NATS服务端的连接虽然显示是“正常”的，但实际上，这个连接已经是无效的了。为什么呢？这是因为NATS服务器崩溃过，NATS服务器和消息订阅者之间的连接中断FIN包，由于异常情况，没能够正常到达消息订阅者，这样造成的结果就是消息订阅者一直维护着一个“过时的”连接，不会收到NATS服务器发送来的消息。</p><p>这个故障的根本原因在于，作为NATS服务器的客户端，消息订阅者没有及时对连接的有效性进行检测，这样就造成了问题。</p><p>保持对连接有效性的检测，是我们在实战中必须要注意的一个点。</p><h2 id="tcp-keep-alive选项" tabindex="-1"><a class="header-anchor" href="#tcp-keep-alive选项"><span>TCP Keep-Alive选项</span></a></h2><p>很多刚接触TCP编程的人会惊讶地发现，在没有数据读写的“静默”的连接上，是没有办法发现TCP连接是有效还是无效的。比如客户端突然崩溃，服务器端可能在几天内都维护着一个无用的 TCP连接。前面提到的例子就是这样的一个场景。</p><p>那么有没有办法开启类似的“轮询”机制，让TCP告诉我们，连接是不是“活着”的呢？</p><p>这就是TCP保持活跃机制所要解决的问题。实际上，TCP有一个保持活跃的机制叫做Keep-Alive。</p><p>这个机制的原理是这样的：</p><p>定义一个时间段，在这个时间段内，如果没有任何连接相关的活动，TCP保活机制会开始作用，每隔一个时间间隔，发送一个探测报文，该探测报文包含的数据非常少，如果连续几个探测报文都没有得到响应，则认为当前的TCP连接已经死亡，系统内核将错误信息通知给上层应用程序。</p><p>上述的可定义变量，分别被称为保活时间、保活时间间隔和保活探测次数。在Linux系统中，这些变量分别对应sysctl变量<code>net.ipv4.tcp_keepalive_time</code>、<code>net.ipv4.tcp_keepalive_intvl</code>、 <code>net.ipv4.tcp_keepalve_probes</code>，默认设置是7200秒（2小时）、75秒和9次探测。</p><p>如果开启了TCP保活，需要考虑以下几种情况：</p><p>第一种，对端程序是正常工作的。当TCP保活的探测报文发送给对端, 对端会正常响应，这样TCP保活时间会被重置，等待下一个TCP保活时间的到来。</p><p>第二种，对端程序崩溃并重启。当TCP保活的探测报文发送给对端后，对端是可以响应的，但由于没有该连接的有效信息，会产生一个RST报文，这样很快就会发现TCP连接已经被重置。</p><p>第三种，是对端程序崩溃，或对端由于其他原因导致报文不可达。当TCP保活的探测报文发送给对端后，石沉大海，没有响应，连续几次，达到保活探测次数后，TCP会报告该TCP连接已经死亡。</p><p>TCP保活机制默认是关闭的，当我们选择打开时，可以分别在连接的两个方向上开启，也可以单独在一个方向上开启。如果开启服务器端到客户端的检测，就可以在客户端非正常断连的情况下清除在服务器端保留的“脏数据”；而开启客户端到服务器端的检测，就可以在服务器无响应的情况下，重新发起连接。</p><p>为什么TCP不提供一个频率很好的保活机制呢？我的理解是早期的网络带宽非常有限，如果提供一个频率很高的保活机制，对有限的带宽是一个比较严重的浪费。</p><h2 id="应用层探活" tabindex="-1"><a class="header-anchor" href="#应用层探活"><span>应用层探活</span></a></h2><p>如果使用TCP自身的keep-Alive机制，在Linux系统中，最少需要经过2小时11分15秒才可以发现一个“死亡”连接。这个时间是怎么计算出来的呢？其实是通过2小时，加上75秒乘以9的总和。实际上，对很多对时延要求敏感的系统中，这个时间间隔是不可接受的。</p><p>所以，必须在应用程序这一层来寻找更好的解决方案。</p><p>我们可以通过在应用程序中模拟TCP Keep-Alive机制，来完成在应用层的连接探活。</p><p>我们可以设计一个PING-PONG的机制，需要保活的一方，比如客户端，在保活时间达到后，发起对连接的PING操作，如果服务器端对PING操作有回应，则重新设置保活时间，否则对探测次数进行计数，如果最终探测次数达到了保活探测次数预先设置的值之后，则认为连接已经无效。</p><p>这里有两个比较关键的点：</p><p>第一个是需要使用定时器，这可以通过使用I/O复用自身的机制来实现；第二个是需要设计一个PING-PONG的协议。</p><p>下面我们尝试来完成这样的一个设计。</p><h3 id="消息格式设计" tabindex="-1"><a class="header-anchor" href="#消息格式设计"><span>消息格式设计</span></a></h3><p>我们的程序是客户端来发起保活，为此定义了一个消息对象。你可以看到这个消息对象，这个消息对象是一个结构体，前4个字节标识了消息类型，为了简单，这里设计了<code>MSG_PING</code>、<code>MSG_PONG</code>、<code>MSG_TYPE 1</code>和<code>MSG_TYPE 2</code>四种消息类型。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>typedef struct {</span></span>
<span class="line"><span>    u_int32_t type;</span></span>
<span class="line"><span>    char data[1024];</span></span>
<span class="line"><span>} messageObject;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define MSG_PING          1</span></span>
<span class="line"><span>#define MSG_PONG          2</span></span>
<span class="line"><span>#define MSG_TYPE1        11</span></span>
<span class="line"><span>#define MSG_TYPE2        21</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端程序设计" tabindex="-1"><a class="header-anchor" href="#客户端程序设计"><span>客户端程序设计</span></a></h3><p>客户端完全模拟TCP Keep-Alive的机制，在保活时间达到后，探活次数增加1，同时向服务器端发送PING格式的消息，此后以预设的保活时间间隔，不断地向服务器端发送PING格式的消息。如果能收到服务器端的应答，则结束保活，将保活时间置为0。</p><p>这里我们使用select I/O复用函数自带的定时器，select函数将在后面详细介绍。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span>#include &amp;quot;message_objecte.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define    MAXLINE     4096</span></span>
<span class="line"><span>#define    KEEP_ALIVE_TIME  10</span></span>
<span class="line"><span>#define    KEEP_ALIVE_INTERVAL  3</span></span>
<span class="line"><span>#define    KEEP_ALIVE_PROBETIMES  3</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: tcpclient &amp;lt;IPaddress&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span>    char recv_line[MAXLINE + 1];</span></span>
<span class="line"><span>    int n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fd_set readmask;</span></span>
<span class="line"><span>    fd_set allreads;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct timeval tv;</span></span>
<span class="line"><span>    int heartbeats = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tv.tv_sec = KEEP_ALIVE_TIME;</span></span>
<span class="line"><span>    tv.tv_usec = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    messageObject messageObject;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    FD_ZERO(&amp;amp;allreads);</span></span>
<span class="line"><span>    FD_SET(socket_fd, &amp;amp;allreads);</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        readmask = allreads;</span></span>
<span class="line"><span>        int rc = select(socket_fd + 1, &amp;amp;readmask, NULL, NULL, &amp;amp;tv);</span></span>
<span class="line"><span>        if (rc &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;select failed&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (rc == 0) {</span></span>
<span class="line"><span>            if (++heartbeats &amp;gt; KEEP_ALIVE_PROBETIMES) {</span></span>
<span class="line"><span>                error(1, 0, &amp;quot;connection dead\\n&amp;quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            printf(&amp;quot;sending heartbeat #%d\\n&amp;quot;, heartbeats);</span></span>
<span class="line"><span>            messageObject.type = htonl(MSG_PING);</span></span>
<span class="line"><span>            rc = send(socket_fd, (char *) &amp;amp;messageObject, sizeof(messageObject), 0);</span></span>
<span class="line"><span>            if (rc &amp;lt; 0) {</span></span>
<span class="line"><span>                error(1, errno, &amp;quot;send failure&amp;quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            tv.tv_sec = KEEP_ALIVE_INTERVAL;</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (FD_ISSET(socket_fd, &amp;amp;readmask)) {</span></span>
<span class="line"><span>            n = read(socket_fd, recv_line, MAXLINE);</span></span>
<span class="line"><span>            if (n &amp;lt; 0) {</span></span>
<span class="line"><span>                error(1, errno, &amp;quot;read error&amp;quot;);</span></span>
<span class="line"><span>            } else if (n == 0) {</span></span>
<span class="line"><span>                error(1, 0, &amp;quot;server terminated \\n&amp;quot;);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            printf(&amp;quot;received heartbeat, make heartbeats to 0 \\n&amp;quot;);</span></span>
<span class="line"><span>            heartbeats = 0;</span></span>
<span class="line"><span>            tv.tv_sec = KEEP_ALIVE_TIME;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个程序主要分成三大部分：</p><p>第一部分为套接字的创建和连接建立：</p><ul><li>15-16行，创建了TCP套接字；</li><li>18-22行，创建了IPv4目标地址，其实就是服务器端地址，注意这里使用的是传入参数作为服务器地址；</li><li>24-28行，向服务器端发起连接。</li></ul><p>第二部分为select定时器准备：</p><ul><li>39-40行，设置了超时时间为KEEP_ALIVE_TIME，这相当于保活时间；</li><li>44-45行，初始化select函数的套接字。</li></ul><p>最重要的为第三部分，这一部分需要处理心跳报文：</p><ul><li>48行调用select函数，感知I/O事件。这里的I/O事件，除了套接字上的读操作之外，还有在39-40行设置的超时事件。当KEEP_ALIVE_TIME这段时间到达之后，select函数会返回0，于是进入53-63行的处理；</li><li>在53-63行，客户端已经在KEEP_ALIVE_TIME这段时间内没有收到任何对当前连接的反馈，于是发起PING消息，尝试问服务器端：“喂，你还活着吗？”这里我们通过传送一个类型为MSG_PING的消息对象来完成PING操作，之后我们会看到服务器端程序如何响应这个PING操作；</li><li>第65-74行是客户端在接收到服务器端程序之后的处理。为了简单，这里就没有再进行报文格式的转换和分析。在实际的工作中，这里其实是需要对报文进行解析后处理的，只有是PONG类型的回应，我们才认为是PING探活的结果。这里认为既然收到服务器端的报文，那么连接就是正常的，所以会对探活计数器和探活时间都置零，等待下一次探活时间的来临。</li></ul><h3 id="服务器端程序设计" tabindex="-1"><a class="header-anchor" href="#服务器端程序设计"><span>服务器端程序设计</span></a></h3><p>服务器端的程序接受一个参数，这个参数设置的比较大，可以模拟连接没有响应的情况。服务器端程序在接收到客户端发送来的各种消息后，进行处理，其中如果发现是PING类型的消息，在休眠一段时间后回复一个PONG消息，告诉客户端：“嗯，我还活着。”当然，如果这个休眠时间很长的话，那么客户端就无法快速知道服务器端是否存活，这是我们模拟连接无响应的一个手段而已，实际情况下，应该是系统崩溃，或者网络异常。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span>#include &amp;quot;message_objecte.h&amp;quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int count;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char **argv) {</span></span>
<span class="line"><span>    if (argc != 2) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;usage: tcpsever &amp;lt;sleepingtime&amp;gt;&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int sleepingTime = atoi(argv[1]);</span></span>
<span class="line"><span></span></span>
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
<span class="line"><span>    int connfd;</span></span>
<span class="line"><span>    struct sockaddr_in client_addr;</span></span>
<span class="line"><span>    socklen_t client_len = sizeof(client_addr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ((connfd = accept(listenfd, (struct sockaddr *) &amp;amp;client_addr, &amp;amp;client_len)) &amp;lt; 0) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;bind failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    messageObject message;</span></span>
<span class="line"><span>    count = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        int n = read(connfd, (char *) &amp;amp;message, sizeof(messageObject));</span></span>
<span class="line"><span>        if (n &amp;lt; 0) {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;error read&amp;quot;);</span></span>
<span class="line"><span>        } else if (n == 0) {</span></span>
<span class="line"><span>            error(1, 0, &amp;quot;client closed \\n&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        printf(&amp;quot;received %d bytes\\n&amp;quot;, n);</span></span>
<span class="line"><span>        count++;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        switch (ntohl(message.type)) {</span></span>
<span class="line"><span>            case MSG_TYPE1 :</span></span>
<span class="line"><span>                printf(&amp;quot;process  MSG_TYPE1 \\n&amp;quot;);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            case MSG_TYPE2 :</span></span>
<span class="line"><span>                printf(&amp;quot;process  MSG_TYPE2 \\n&amp;quot;);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            case MSG_PING: {</span></span>
<span class="line"><span>                messageObject pong_message;</span></span>
<span class="line"><span>                pong_message.type = MSG_PONG;</span></span>
<span class="line"><span>                sleep(sleepingTime);</span></span>
<span class="line"><span>                ssize_t rc = send(connfd, (char *) &amp;amp;pong_message, sizeof(pong_message), 0);</span></span>
<span class="line"><span>                if (rc &amp;lt; 0)</span></span>
<span class="line"><span>                    error(1, errno, &amp;quot;send failure&amp;quot;);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            default :</span></span>
<span class="line"><span>                error(1, 0, &amp;quot;unknown message type (%d)\\n&amp;quot;, ntohl(message.type));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务器端程序主要分为两个部分。</p><p>第一部分为监听过程的建立，包括7-38行； 第13-14行先创建一个本地TCP监听套接字；16-20行绑定该套接字到本地端口和ANY地址上；第27-38行分别调用listen和accept完成被动套接字转换和监听。</p><p>第二部分为43行到77行，从建立的连接套接字上读取数据，解析报文，根据消息类型进行不同的处理。</p><ul><li>55-57行为处理MSG_TYPE1的消息；</li><li>59-61行为处理MSG_TYPE2的消息；</li><li>重点是64-72行处理MSG_PING类型的消息。通过休眠来模拟响应是否及时，然后调用send函数发送一个PONG报文，向客户端表示“还活着”的意思；</li><li>74行为异常处理，因为消息格式不认识，所以程序出错退出。</li></ul><h2 id="实验" tabindex="-1"><a class="header-anchor" href="#实验"><span>实验</span></a></h2><p>基于上面的程序设计，让我们分别做两个不同的实验：</p><p>第一次实验，服务器端休眠时间为60秒。</p><p>我们看到，客户端在发送了三次心跳检测报文PING报文后，判断出连接无效，直接退出了。之所以造成这样的结果，是因为在这段时间内没有接收到来自服务器端的任何PONG报文。当然，实际工作的程序，可能需要不一样的处理，比如重新发起连接。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./pingclient 127.0.0.1</span></span>
<span class="line"><span>sending heartbeat #1</span></span>
<span class="line"><span>sending heartbeat #2</span></span>
<span class="line"><span>sending heartbeat #3</span></span>
<span class="line"><span>connection dead</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./pingserver 60</span></span>
<span class="line"><span>received 1028 bytes</span></span>
<span class="line"><span>received 1028 bytes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二次实验，我们让服务器端休眠时间为5秒。</p><p>我们看到，由于这一次服务器端在心跳检测过程中，及时地进行了响应，客户端一直都会认为连接是正常的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./pingclient 127.0.0.1</span></span>
<span class="line"><span>sending heartbeat #1</span></span>
<span class="line"><span>sending heartbeat #2</span></span>
<span class="line"><span>received heartbeat, make heartbeats to 0</span></span>
<span class="line"><span>received heartbeat, make heartbeats to 0</span></span>
<span class="line"><span>sending heartbeat #1</span></span>
<span class="line"><span>sending heartbeat #2</span></span>
<span class="line"><span>received heartbeat, make heartbeats to 0</span></span>
<span class="line"><span>received heartbeat, make heartbeats to 0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>$./pingserver 5</span></span>
<span class="line"><span>received 1028 bytes</span></span>
<span class="line"><span>received 1028 bytes</span></span>
<span class="line"><span>received 1028 bytes</span></span>
<span class="line"><span>received 1028 bytes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>通过今天的文章，我们能看到虽然TCP没有提供系统的保活能力，让应用程序可以方便地感知连接的存活，但是，我们可以在应用程序里灵活地建立这种机制。一般来说，这种机制的建立依赖于系统定时器，以及恰当的应用层报文协议。比如，使用心跳包就是这样一种保持Keep Alive的机制。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>和往常一样，我留两道思考题：</p><p>你可以看到今天的内容主要是针对TCP的探活，那么你觉得这样的方法是否同样适用于UDP呢？</p><p>第二道题是，有人说额外的探活报文占用了有限的带宽，对此你是怎么想的呢？而且，为什么需要多次探活才能决定一个TCP连接是否已经死亡呢？</p><p>欢迎你在评论区写下你的思考，我会和你一起交流。也欢迎把这篇文章分享给你的朋友或者同事，与他们一起讨论一下这两个问题吧。</p>`,72)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%8F%90%E9%AB%98%E7%AF%87/12%20_%20%E8%BF%9E%E6%8E%A5%E6%97%A0%E6%95%88%EF%BC%9A%E4%BD%BF%E7%94%A8Keep-Alive%E8%BF%98%E6%98%AF%E5%BA%94%E7%94%A8%E5%BF%83%E8%B7%B3%E6%9D%A5%E6%A3%80%E6%B5%8B%EF%BC%9F.html","title":"12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？","lang":"zh-CN","frontmatter":{"description":"12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？ 你好，我是盛延敏，这里是网络编程实战第12讲，欢迎回来。 上一篇文章中，我们讲到了如何使用close和shutdown来完成连接的关闭，在大多数情况下，我们会优选shutdown来完成对连接一个方向的关闭，待对端处理完之后，再完成另外一个方向的关闭。 在很多情况下，连接的一端需要一直感知...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%8F%90%E9%AB%98%E7%AF%87/12%20_%20%E8%BF%9E%E6%8E%A5%E6%97%A0%E6%95%88%EF%BC%9A%E4%BD%BF%E7%94%A8Keep-Alive%E8%BF%98%E6%98%AF%E5%BA%94%E7%94%A8%E5%BF%83%E8%B7%B3%E6%9D%A5%E6%A3%80%E6%B5%8B%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？"}],["meta",{"property":"og:description","content":"12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？ 你好，我是盛延敏，这里是网络编程实战第12讲，欢迎回来。 上一篇文章中，我们讲到了如何使用close和shutdown来完成连接的关闭，在大多数情况下，我们会优选shutdown来完成对连接一个方向的关闭，待对端处理完之后，再完成另外一个方向的关闭。 在很多情况下，连接的一端需要一直感知..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":12.83,"words":3850},"filePathRelative":"posts/网络编程实战/第二模块：提高篇/12 _ 连接无效：使用Keep-Alive还是应用心跳来检测？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"12 | 连接无效：使用Keep-Alive还是应用心跳来检测？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/58/60/586941b4a8a67086dc4151bf00541d60.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第12讲，欢迎回来。</p>\\n<p>上一篇文章中，我们讲到了如何使用close和shutdown来完成连接的关闭，在大多数情况下，我们会优选shutdown来完成对连接一个方向的关闭，待对端处理完之后，再完成另外一个方向的关闭。</p>","autoDesc":true}');export{t as comp,v as data};
