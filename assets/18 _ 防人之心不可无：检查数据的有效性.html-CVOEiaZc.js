import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const l={};function p(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_18-防人之心不可无-检查数据的有效性" tabindex="-1"><a class="header-anchor" href="#_18-防人之心不可无-检查数据的有效性"><span>18 _ 防人之心不可无：检查数据的有效性</span></a></h1><p><audio id="audio" title="18 | 防人之心不可无：检查数据的有效性" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/6d/c4/6d1debeb6162a55ea86c0e68df7c6dc4.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战第18讲，欢迎回来。</p><p>在前面一讲中，我们仔细分析了引起故障的原因，并且已经知道为了应对可能出现的各种故障，必须在程序中做好防御工作。</p><p>在这一讲里，我们继续前面的讨论，看一看为了增强程序的健壮性，我们还需要准备什么。</p><h2 id="对端的异常状况" tabindex="-1"><a class="header-anchor" href="#对端的异常状况"><span>对端的异常状况</span></a></h2><p>在前面的第11讲以及第17讲中，我们已经初步接触过一些防范对端异常的方法，比如，通过read等调用时，可以通过对EOF的判断，随时防范对方程序崩溃。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int nBytes = recv(connfd, buffer, sizeof(buffer), 0);</span></span>
<span class="line"><span>if (nBytes == -1) {</span></span>
<span class="line"><span>    error(1, errno, &amp;quot;error read message&amp;quot;);</span></span>
<span class="line"><span>} else if (nBytes == 0) {</span></span>
<span class="line"><span>    error(1, 0, &amp;quot;client closed \\n&amp;quot;);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你可以看到这一个程序中的第4行，当调用read函数返回0字节时，实际上就是操作系统内核返回EOF的一种反映。如果是服务器端同时处理多个客户端连接，一般这里会调用shutdown关闭连接的这一端。</p><p>上一讲也讲到了，不是每种情况都可以通过读操作来感知异常，比如，服务器完全崩溃，或者网络中断的情况下，此时，如果是阻塞套接字，会一直阻塞在read等调用上，没有办法感知套接字的异常。</p><p>其实有几种办法来解决这个问题。</p><p>第一个办法是给套接字的read操作设置超时，如果超过了一段时间就认为连接已经不存在。具体的代码片段如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct timeval tv;</span></span>
<span class="line"><span>tv.tv_sec = 5;</span></span>
<span class="line"><span>tv.tv_usec = 0;</span></span>
<span class="line"><span>setsockopt(connfd, SOL_SOCKET, SO_RCVTIMEO, (const char *) &amp;amp;tv, sizeof tv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while (1) {</span></span>
<span class="line"><span>    int nBytes = recv(connfd, buffer, sizeof(buffer), 0);</span></span>
<span class="line"><span>    if (nBytes == -1) {</span></span>
<span class="line"><span>        if (errno == EAGAIN || errno == EWOULDBLOCK) {</span></span>
<span class="line"><span>            printf(&amp;quot;read timeout\\n&amp;quot;);</span></span>
<span class="line"><span>            onClientTimeout(connfd);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            error(1, errno, &amp;quot;error read message&amp;quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else if (nBytes == 0) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;client closed \\n&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个代码片段在第4行调用setsockopt函数，设置了套接字的读操作超时，超时时间为在第1-3行设置的5秒，当然在这里这个时间值是“拍脑袋”设置的，比较科学的设置方法是通过一定的统计之后得到一个比较合理的值。关键之处在读操作返回异常的第9-11行，根据出错信息是<code>EAGAIN</code>或者<code>EWOULDBLOCK</code>，判断出超时，转而调用<code>onClientTimeout</code>函数来进行处理。</p><p>这个处理方式虽然比较简单，却很实用，很多FTP服务器端就是这么设计的。连接这种FTP服务器之后，如果FTP的客户端没有续传的功能，在碰到网络故障或服务器崩溃时就会挂断。</p><p>第二个办法是第12讲中提到的办法，添加对连接是否正常的检测。如果连接不正常，需要从当前read阻塞中返回并处理。</p><p>还有一个办法，前面第12讲也提到过，那就是利用多路复用技术自带的超时能力，来完成对套接字I/O的检查，如果超过了预设的时间，就进入异常处理。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct timeval tv;</span></span>
<span class="line"><span>tv.tv_sec = 5;</span></span>
<span class="line"><span>tv.tv_usec = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FD_ZERO(&amp;amp;allreads);</span></span>
<span class="line"><span>FD_SET(socket_fd, &amp;amp;allreads);</span></span>
<span class="line"><span>for (;;) {</span></span>
<span class="line"><span>    readmask = allreads;</span></span>
<span class="line"><span>    int rc = select(socket_fd + 1, &amp;amp;readmask, NULL, NULL, &amp;amp;tv);</span></span>
<span class="line"><span>    if (rc &amp;lt; 0) {</span></span>
<span class="line"><span>      error(1, errno, &amp;quot;select failed&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (rc == 0) {</span></span>
<span class="line"><span>      printf(&amp;quot;read timeout\\n&amp;quot;);</span></span>
<span class="line"><span>      onClientTimeout(socket_fd);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> ...   </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码使用了select多路复用技术来对套接字进行I/O事件的轮询，程序的13行是到达超时后的处理逻辑，调用<code>onClientTimeout</code>函数来进行超时后的处理。</p><h2 id="缓冲区处理" tabindex="-1"><a class="header-anchor" href="#缓冲区处理"><span>缓冲区处理</span></a></h2><p>一个设计良好的网络程序，应该可以在随机输入的情况下表现稳定。不仅是这样，随着互联网的发展，网络安全也愈发重要，我们编写的网络程序能不能在黑客的刻意攻击之下表现稳定，也是一个重要考量因素。</p><p>很多黑客程序，会针对性地构建出一定格式的网络协议包，导致网络程序产生诸如缓冲区溢出、指针异常的后果，影响程序的服务能力，严重的甚至可以夺取服务器端的控制权，随心所欲地进行破坏活动，比如著名的SQL注入，就是通过针对性地构造出SQL语句，完成对数据库敏感信息的窃取。</p><p>所以，在网络程序的编写过程中，我们需要时时刻刻提醒自己面对的是各种复杂异常的场景，甚至是别有用心的攻击者，保持“防人之心不可无”的警惕。</p><p>那么程序都有可能出现哪几种漏洞呢？</p><h3 id="第一个例子" tabindex="-1"><a class="header-anchor" href="#第一个例子"><span>第一个例子</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>char Response[] = &amp;quot;COMMAND OK&amp;quot;;</span></span>
<span class="line"><span>char buffer[128];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while (1) {</span></span>
<span class="line"><span>    int nBytes = recv(connfd, buffer, sizeof(buffer), 0);</span></span>
<span class="line"><span>    if (nBytes == -1) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;error read message&amp;quot;);</span></span>
<span class="line"><span>    } else if (nBytes == 0) {</span></span>
<span class="line"><span>        error(1, 0, &amp;quot;client closed \\n&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    buffer[nBytes] = &#39;\\0&#39;;</span></span>
<span class="line"><span>    if (strcmp(buffer, &amp;quot;quit&amp;quot;) == 0) {</span></span>
<span class="line"><span>        printf(&amp;quot;client quit\\n&amp;quot;);</span></span>
<span class="line"><span>        send(socket, Response, sizeof(Response), 0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    printf(&amp;quot;received %d bytes: %s\\n&amp;quot;, nBytes, buffer);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码从连接套接字中获取字节流，并且判断了出差和EOF情况，如果对端发送来的字符是“quit”就回应“COMAAND OK”的字符流，乍看上去一切正常。</p><p>但仔细看一下，这段代码很有可能会产生下面的结果。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>char buffer[128];</span></span>
<span class="line"><span>buffer[128] = &#39;\\0&#39;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>通过recv读取的字符数为128时，就会这样的结果。因为buffer的大小只有128字节，最后的赋值环节，产生了缓冲区溢出的问题。</p><p>所谓缓冲区溢出，是指计算机程序中出现的一种内存违规操作。本质是计算机程序向缓冲区填充的数据，超出了原本缓冲区设置的大小限制，导致了数据覆盖了内存栈空间的其他合法数据。这种覆盖破坏了原来程序的完整性，使用过游戏修改器的同学肯定知道，如果不小心修改错游戏数据的内存空间，很可能导致应用程序产生如“Access violation”的错误，导致应用程序崩溃。</p><p>我们可以对这个程序稍加修改，主要的想法是留下buffer里的一个字节，以容纳后面的<code>&#39;\\0&#39;</code>。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>int nBytes = recv(connfd, buffer, sizeof(buffer)-1, 0);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这个例子里面，还昭示了一个有趣的现象。你会发现我们发送过去的字符串，调用的是<code>sizeof</code>，那也就意味着，Response字符串中的<code>&#39;\\0&#39;</code>是被发送出去的，而我们在接收字符时，则假设没有<code>&#39;\\0&#39;</code>字符的存在。</p><p>为了统一，我们可以改成如下的方式，使用strlen的方式忽略最后一个<code>&#39;\\0&#39;</code>字符。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>send(socket, Response, strlen(Response), 0);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="第二个例子" tabindex="-1"><a class="header-anchor" href="#第二个例子"><span>第二个例子</span></a></h3><p>第16讲中提到了对变长报文解析的两种手段，一个是使用特殊的边界符号，例如HTTP使用的回车换行符；另一个是将报文信息的长度编码进入消息。</p><p>在实战中，我们也需要对这部分报文长度保持警惕。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>size_t read_message(int fd, char *buffer, size_t length) {</span></span>
<span class="line"><span>    u_int32_t msg_length;</span></span>
<span class="line"><span>    u_int32_t msg_type;</span></span>
<span class="line"><span>    int rc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    rc = readn(fd, (char *) &amp;amp;msg_length, sizeof(u_int32_t));</span></span>
<span class="line"><span>    if (rc != sizeof(u_int32_t))</span></span>
<span class="line"><span>        return rc &amp;lt; 0 ? -1 : 0;</span></span>
<span class="line"><span>    msg_length = ntohl(msg_length);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    rc = readn(fd, (char *) &amp;amp;msg_type, sizeof(msg_type));</span></span>
<span class="line"><span>    if (rc != sizeof(u_int32_t))</span></span>
<span class="line"><span>        return rc &amp;lt; 0 ? -1 : 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (msg_length &amp;gt; length) {</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* Retrieve the record itself */</span></span>
<span class="line"><span>    rc = readn(fd, buffer, msg_length);</span></span>
<span class="line"><span>    if (rc != msg_length)</span></span>
<span class="line"><span>        return rc &amp;lt; 0 ? -1 : 0;</span></span>
<span class="line"><span>    return rc;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在进行报文解析时，第15行对实际的报文长度<code>msg_length</code>和应用程序分配的缓冲区大小进行了比较，如果报文长度过大，导致缓冲区容纳不下，直接返回-1表示出错。千万不要小看这部分的判断，试想如果没有这个判断，对方程序发送出来的消息体，可能构建出一个非常大的<code>msg_length</code>，而实际发送的报文本体长度却没有这么大，这样后面的读取操作就不会成功，如果应用程序实际缓冲区大小比<code>msg_length</code>小，也产生了缓冲区溢出的问题。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct {</span></span>
<span class="line"><span>    u_int32_t message_length;</span></span>
<span class="line"><span>    u_int32_t message_type;</span></span>
<span class="line"><span>    char data[128];</span></span>
<span class="line"><span>} message;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int n = 65535;</span></span>
<span class="line"><span>message.message_length = htonl(n);</span></span>
<span class="line"><span>message.message_type = 1;</span></span>
<span class="line"><span>char buf[128] = &amp;quot;just for fun\\0&amp;quot;;</span></span>
<span class="line"><span>strncpy(message.data, buf, strlen(buf));</span></span>
<span class="line"><span>if (send(socket_fd, (char *) &amp;amp;message,</span></span>
<span class="line"><span>         sizeof(message.message_length) + sizeof(message.message_type) + strlen(message.data), 0) &amp;lt; 0)</span></span>
<span class="line"><span>    error(1, errno, &amp;quot;send failure&amp;quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就是这样一段发送端“不小心”构造的一个程序，消息的长度“不小心”被设置为65535长度，实际发送的报文数据为“just for fun”。在去掉实际的报文长度<code>msg_length</code>和应用程序分配的缓冲区大小做比较之后，服务器端一直阻塞在read调用上，这是因为服务器端误认为需要接收65535大小的字节。</p><h3 id="第三个例子" tabindex="-1"><a class="header-anchor" href="#第三个例子"><span>第三个例子</span></a></h3><p>如果我们需要开发一个函数，这个函数假设报文的分界符是换行符（\\n），一个简单的想法是每次读取一个字符，判断这个字符是不是换行符。</p><p>这里有一个这样的函数，这个函数的最大问题是工作效率太低，要知道每次调用recv函数都是一次系统调用，需要从用户空间切换到内核空间，上下文切换的开销对于高性能来说最好是能省则省。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>size_t readline(int fd, char *buffer, size_t length) {</span></span>
<span class="line"><span>    char *buf_first = buffer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char c;</span></span>
<span class="line"><span>    while (length &amp;gt; 0 &amp;amp;&amp;amp; recv(fd, &amp;amp;c, 1, 0) == 1) {</span></span>
<span class="line"><span>        *buffer++ = c;</span></span>
<span class="line"><span>        length--;</span></span>
<span class="line"><span>        if (c == &#39;\\n&#39;) {</span></span>
<span class="line"><span>            *buffer = &#39;\\0&#39;;</span></span>
<span class="line"><span>            return buffer - buf_first;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return -1;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>于是，就有了第二个版本，这个函数一次性读取最多512字节到临时缓冲区，之后将临时缓冲区的字符一个一个拷贝到应用程序最终的缓冲区中，这样的做法明显效率会高很多。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>size_t readline(int fd, char *buffer, size_t length) {</span></span>
<span class="line"><span>    char *buf_first = buffer;</span></span>
<span class="line"><span>    static char *buffer_pointer;</span></span>
<span class="line"><span>    int nleft = 0;</span></span>
<span class="line"><span>    static char read_buffer[512];</span></span>
<span class="line"><span>    char c;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (length-- &amp;gt; 0) {</span></span>
<span class="line"><span>        if (nleft &amp;lt;= 0) {</span></span>
<span class="line"><span>            int nread = recv(fd, read_buffer, sizeof(read_buffer), 0);</span></span>
<span class="line"><span>            if (nread &amp;lt; 0) {</span></span>
<span class="line"><span>                if (errno == EINTR) {</span></span>
<span class="line"><span>                    length++;</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return -1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (nread == 0)</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>            buffer_pointer = read_buffer;</span></span>
<span class="line"><span>            nleft = nread;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        c = *buffer_pointer++;</span></span>
<span class="line"><span>        *buffer++ = c;</span></span>
<span class="line"><span>        nleft--;</span></span>
<span class="line"><span>        if (c == &#39;\\n&#39;) {</span></span>
<span class="line"><span>            *buffer = &#39;\\0&#39;;</span></span>
<span class="line"><span>            return buffer - buf_first;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return -1;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个程序的主循环在第8行，通过对length变量的判断，试图解决缓冲区长度溢出问题；第9行是判断临时缓冲区的字符有没有被全部拷贝完，如果被全部拷贝完，就会再次尝试读取最多512字节；第20-21行在读取字符成功之后，重置了临时缓冲区读指针、临时缓冲区待读的字符个数；第23-25行则是在拷贝临时缓冲区字符，每次拷贝一个字符，并移动临时缓冲区读指针，对临时缓冲区待读的字符个数进行减1操作。在程序的26-28行，判断是否读到换行符，如果读到则将应用程序最终缓冲区截断，返回最终读取的字符个数。</p><p>这个程序运行起来可能很久都没有问题，但是，它还是有一个微小的瑕疵，这个瑕疵很可能会造成线上故障。</p><p>为了讲清这个故障，我们假设这样调用， 输入的字符为<code>012345678\\n</code>。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//输入字符为: 012345678\\n</span></span>
<span class="line"><span>char buf[10]</span></span>
<span class="line"><span>readline(fd, buf, 10)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当读到最后一个\\n字符时，length为1，问题是在第26行和27行，如果读到了换行符，就会增加一个字符串截止符，这显然越过了应用程序缓冲区的大小。</p><p>这是正确的程序，这里最关键的是需要先对length进行处理，再去判断length的大小是否可以容纳下字符。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>size_t readline(int fd, char *buffer, size_t length) {</span></span>
<span class="line"><span>    char *buf_first = buffer;</span></span>
<span class="line"><span>    static char *buffer_pointer;</span></span>
<span class="line"><span>    int nleft = 0;</span></span>
<span class="line"><span>    static char read_buffer[512];</span></span>
<span class="line"><span>    char c;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (--length&amp;gt; 0) {</span></span>
<span class="line"><span>        if (nleft &amp;lt;= 0) {</span></span>
<span class="line"><span>            int nread = recv(fd, read_buffer, sizeof(read_buffer), 0);</span></span>
<span class="line"><span>            if (nread &amp;lt; 0) {</span></span>
<span class="line"><span>                if (errno == EINTR) {</span></span>
<span class="line"><span>                    length++;</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                return -1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (nread == 0)</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>            buffer_pointer = read_buffer;</span></span>
<span class="line"><span>            nleft = nread;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        c = *buffer_pointer++;</span></span>
<span class="line"><span>        *buffer++ = c;</span></span>
<span class="line"><span>        nleft--;</span></span>
<span class="line"><span>        if (c == &#39;\\n&#39;) {</span></span>
<span class="line"><span>            *buffer = &#39;\\0&#39;;</span></span>
<span class="line"><span>            return buffer - buf_first;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return -1;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>今天的内容到这里就结束了。让我们总结一下： 在网络编程中，是否做好了对各种异常边界的检测，将决定我们的程序在恶劣情况下的稳定性，所以，我们一定要时刻提醒自己做好应对各种复杂情况的准备，这里的异常情况包括缓冲区溢出、指针错误、连接超时检测等。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>和往常一样，给你留两道思考题吧。</p><p>第一道，我们在读数据的时候，一般都需要给应用程序最终缓冲区分配大小，这个大小有什么讲究吗？</p><p>第二道，你能分析一下，我们文章中的例子所分配的缓冲是否可以换成动态分配吗？比如调用malloc函数来分配缓冲区？</p><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流一下。</p>`,63)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%8F%90%E9%AB%98%E7%AF%87/18%20_%20%E9%98%B2%E4%BA%BA%E4%B9%8B%E5%BF%83%E4%B8%8D%E5%8F%AF%E6%97%A0%EF%BC%9A%E6%A3%80%E6%9F%A5%E6%95%B0%E6%8D%AE%E7%9A%84%E6%9C%89%E6%95%88%E6%80%A7.html","title":"18 _ 防人之心不可无：检查数据的有效性","lang":"zh-CN","frontmatter":{"description":"18 _ 防人之心不可无：检查数据的有效性 你好，我是盛延敏，这里是网络编程实战第18讲，欢迎回来。 在前面一讲中，我们仔细分析了引起故障的原因，并且已经知道为了应对可能出现的各种故障，必须在程序中做好防御工作。 在这一讲里，我们继续前面的讨论，看一看为了增强程序的健壮性，我们还需要准备什么。 对端的异常状况 在前面的第11讲以及第17讲中，我们已经初...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%BA%8C%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%8F%90%E9%AB%98%E7%AF%87/18%20_%20%E9%98%B2%E4%BA%BA%E4%B9%8B%E5%BF%83%E4%B8%8D%E5%8F%AF%E6%97%A0%EF%BC%9A%E6%A3%80%E6%9F%A5%E6%95%B0%E6%8D%AE%E7%9A%84%E6%9C%89%E6%95%88%E6%80%A7.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"18 _ 防人之心不可无：检查数据的有效性"}],["meta",{"property":"og:description","content":"18 _ 防人之心不可无：检查数据的有效性 你好，我是盛延敏，这里是网络编程实战第18讲，欢迎回来。 在前面一讲中，我们仔细分析了引起故障的原因，并且已经知道为了应对可能出现的各种故障，必须在程序中做好防御工作。 在这一讲里，我们继续前面的讨论，看一看为了增强程序的健壮性，我们还需要准备什么。 对端的异常状况 在前面的第11讲以及第17讲中，我们已经初..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"18 _ 防人之心不可无：检查数据的有效性\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":11.05,"words":3314},"filePathRelative":"posts/网络编程实战/第二模块：提高篇/18 _ 防人之心不可无：检查数据的有效性.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"18 | 防人之心不可无：检查数据的有效性\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/6d/c4/6d1debeb6162a55ea86c0e68df7c6dc4.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战第18讲，欢迎回来。</p>\\n<p>在前面一讲中，我们仔细分析了引起故障的原因，并且已经知道为了应对可能出现的各种故障，必须在程序中做好防御工作。</p>","autoDesc":true}');export{t as comp,v as data};
