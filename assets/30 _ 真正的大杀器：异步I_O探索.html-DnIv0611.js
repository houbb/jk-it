import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const p={};function l(r,n){return e(),a("div",null,n[0]||(n[0]=[i(`<p><audio id="audio" title="30 | 真正的大杀器：异步I/O探索" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/f6/b8/f61c70e6b027c27fd79b1ce51b6007b8.mp3"></audio></p><p>你好，我是盛延敏，这里是网络编程实战的第30讲，欢迎回来。</p><p>在性能篇的前几讲中，我们谈到了阻塞I/O、非阻塞I/O以及像select、poll、epoll等I/O多路复用技术，并在此基础上结合线程技术，实现了以事件分发为核心的reactor反应堆模式。你或许还听说过一个叫做Proactor的网络事件驱动模式，这个Proactor模式和reactor模式到底有什么区别和联系呢？在今天的内容中，我们先讲述异步I/O，再一起揭开以异步I/O为基础的proactor模式的面纱。</p><h2 id="阻塞-非阻塞-vs-同步-异步" tabindex="-1"><a class="header-anchor" href="#阻塞-非阻塞-vs-同步-异步"><span>阻塞/非阻塞 VS 同步/异步</span></a></h2><p>尽管在前面的课程中，多少都涉及到了阻塞、非阻塞、同步、异步的概念，但为了避免看见这些概念一头雾水，今天，我们就先来梳理一下这几个概念。</p><p>第一种是阻塞I/O。阻塞I/O发起的read请求，线程会被挂起，一直等到内核数据准备好，并把数据从内核区域拷贝到应用程序的缓冲区中，当拷贝过程完成，read请求调用才返回。接下来，应用程序就可以对缓冲区的数据进行数据解析。</p><p><img src="https://static001.geekbang.org/resource/image/e7/9a/e7f477d5c2e902de5a23b0e90cf9339a.png" alt=""><br><br> 第二种是非阻塞I/O。非阻塞的read请求在数据未准备好的情况下立即返回，应用程序可以不断轮询内核，直到数据准备好，内核将数据拷贝到应用程序缓冲，并完成这次read调用。注意，这里最后一次read调用，获取数据的过程，<strong>是一个同步的过程。这里的同步指的是内核区域的数据拷贝到缓存区这个过程。</strong></p><p><img src="https://static001.geekbang.org/resource/image/4f/0c/4f93d6e13fb78be2a937f962175c5b0c.png" alt=""><br><br> 每次让应用程序去轮询内核的I/O是否准备好，是一个不经济的做法，因为在轮询的过程中应用进程啥也不能干。于是，像select、poll这样的I/O多路复用技术就隆重登场了。通过I/O事件分发，当内核数据准备好时，再通知应用程序进行操作。这个做法大大改善了应用进程对CPU的利用率，在没有被通知的情况下，应用进程可以使用CPU做其他的事情。</p><p>注意，这里read调用，获取数据的过程，<strong>也是一个同步的过程。</strong></p><p><img src="https://static001.geekbang.org/resource/image/ea/dc/ea8552f28b0b630af702a9e7434f03dc.png" alt=""><br><br> 第一种阻塞I/O我想你已经比较了解了，在阻塞I/O的情况下，应用程序会被挂起，直到获取数据。第二种非阻塞I/O和第三种基于非阻塞I/O的多路复用技术，获取数据的操作不会被阻塞。</p><p>无论是第一种阻塞I/O，还是第二种非阻塞I/O，第三种基于非阻塞I/O的多路复用都是<strong>同步调用技术。为什么这么说呢？因为同步调用、异步调用的说法，是对于获取数据的过程而言的，前面几种最后获取数据的read操作调用，都是同步的，在read调用时，内核将数据从内核空间拷贝到应用程序空间，这个过程是在read函数中同步进行的，如果内核实现的拷贝效率很差，read调用就会在这个同步过程中消耗比较长的时间。</strong></p><p>而真正的异步调用则不用担心这个问题，我们接下来就来介绍第四种I/O技术，当我们发起aio_read之后，就立即返回，内核自动将数据从内核空间拷贝到应用程序空间，这个拷贝过程是异步的，内核自动完成的，和前面的同步操作不一样，应用程序并不需要主动发起拷贝动作。</p><p><img src="https://static001.geekbang.org/resource/image/de/71/de97e727087775971f83c70c38d6f771.png" alt=""><br><br> 还记得<a href="https://time.geekbang.org/column/article/141573" target="_blank" rel="noopener noreferrer">第22</a><a href="https://time.geekbang.org/column/article/141573" target="_blank" rel="noopener noreferrer">讲</a>中讲到的去书店买书的例子吗? 基于这个例子，针对以上的场景，我们可以这么理解。</p><p>第一种阻塞I/O就是你去了书店，告诉老板你想要某本书，然后你就一直在那里等着，直到书店老板翻箱倒柜找到你想要的书。</p><p>第二种非阻塞I/O类似于你去了书店，问老板有没有一本书，老板告诉你没有，你就离开了。一周以后，你又来这个书店，再问这个老板，老板一查，有了，于是你买了这本书。</p><p>第三种基于非阻塞的I/O多路复用，你来到书店告诉老板：“老板，到货给我打电话吧，我再来付钱取书。”</p><p>第四种异步I/O就是你连去书店取书的过程也想省了，你留下地址，付了书费，让老板到货时寄给你，你直接在家里拿到就可以看了。</p><p>这里放置了一张表格，总结了以上几种I/O模型。</p><img src="https://static001.geekbang.org/resource/image/17/32/17191523d4dc62acf48915b7e601e832.png" alt=""><h2 id="aio-read和aio-write的用法" tabindex="-1"><a class="header-anchor" href="#aio-read和aio-write的用法"><span>aio_read和aio_write的用法</span></a></h2><p>听起来，异步I/O有一种高大上的感觉。其实，异步I/O用起来倒是挺简单的。下面我们看一下一个具体的例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &amp;quot;lib/common.h&amp;quot;</span></span>
<span class="line"><span>#include &amp;lt;aio.h&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const int BUF_SIZE = 512;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main() {</span></span>
<span class="line"><span>    int err;</span></span>
<span class="line"><span>    int result_size;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 创建一个临时文件</span></span>
<span class="line"><span>    char tmpname[256];</span></span>
<span class="line"><span>    snprintf(tmpname, sizeof(tmpname), &amp;quot;/tmp/aio_test_%d&amp;quot;, getpid());</span></span>
<span class="line"><span>    unlink(tmpname);</span></span>
<span class="line"><span>    int fd = open(tmpname, O_CREAT | O_RDWR | O_EXCL, S_IRUSR | S_IWUSR);</span></span>
<span class="line"><span>    if (fd == -1) {</span></span>
<span class="line"><span>        error(1, errno, &amp;quot;open file failed &amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    char buf[BUF_SIZE];</span></span>
<span class="line"><span>    struct aiocb aiocb;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化buf缓冲，写入的数据应该为0xfafa这样的,</span></span>
<span class="line"><span>    memset(buf, 0xfa, BUF_SIZE);</span></span>
<span class="line"><span>    memset(&amp;amp;aiocb, 0, sizeof(struct aiocb));</span></span>
<span class="line"><span>    aiocb.aio_fildes = fd;</span></span>
<span class="line"><span>    aiocb.aio_buf = buf;</span></span>
<span class="line"><span>    aiocb.aio_nbytes = BUF_SIZE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //开始写</span></span>
<span class="line"><span>    if (aio_write(&amp;amp;aiocb) == -1) {</span></span>
<span class="line"><span>        printf(&amp;quot; Error at aio_write(): %s\\n&amp;quot;, strerror(errno));</span></span>
<span class="line"><span>        close(fd);</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //因为是异步的，需要判断什么时候写完</span></span>
<span class="line"><span>    while (aio_error(&amp;amp;aiocb) == EINPROGRESS) {</span></span>
<span class="line"><span>        printf(&amp;quot;writing... \\n&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //判断写入的是否正确</span></span>
<span class="line"><span>    err = aio_error(&amp;amp;aiocb);</span></span>
<span class="line"><span>    result_size = aio_return(&amp;amp;aiocb);</span></span>
<span class="line"><span>    if (err != 0 || result_size != BUF_SIZE) {</span></span>
<span class="line"><span>        printf(&amp;quot; aio_write failed() : %s\\n&amp;quot;, strerror(err));</span></span>
<span class="line"><span>        close(fd);</span></span>
<span class="line"><span>        exit(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //下面准备开始读数据</span></span>
<span class="line"><span>    char buffer[BUF_SIZE];</span></span>
<span class="line"><span>    struct aiocb cb;</span></span>
<span class="line"><span>    cb.aio_nbytes = BUF_SIZE;</span></span>
<span class="line"><span>    cb.aio_fildes = fd;</span></span>
<span class="line"><span>    cb.aio_offset = 0;</span></span>
<span class="line"><span>    cb.aio_buf = buffer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 开始读数据</span></span>
<span class="line"><span>    if (aio_read(&amp;amp;cb) == -1) {</span></span>
<span class="line"><span>        printf(&amp;quot; air_read failed() : %s\\n&amp;quot;, strerror(err));</span></span>
<span class="line"><span>        close(fd);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //因为是异步的，需要判断什么时候读完</span></span>
<span class="line"><span>    while (aio_error(&amp;amp;cb) == EINPROGRESS) {</span></span>
<span class="line"><span>        printf(&amp;quot;Reading... \\n&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 判断读是否成功</span></span>
<span class="line"><span>    int numBytes = aio_return(&amp;amp;cb);</span></span>
<span class="line"><span>    if (numBytes != -1) {</span></span>
<span class="line"><span>        printf(&amp;quot;Success.\\n&amp;quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        printf(&amp;quot;Error.\\n&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 清理文件句柄</span></span>
<span class="line"><span>    close(fd);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个程序展示了如何使用aio系列函数来完成异步读写。主要用到的函数有:</p><ul><li>aio_write：用来向内核提交异步写操作；</li><li>aio_read：用来向内核提交异步读操作；</li><li>aio_error：获取当前异步操作的状态；</li><li>aio_return：获取异步操作读、写的字节数。</li></ul><p>这个程序一开始使用aio_write方法向内核提交了一个异步写文件的操作。第23-27行是这个异步写操作的结构体。结构体aiocb是应用程序和操作系统内核传递的异步申请数据结构，这里我们使用了文件描述符、缓冲区指针aio_buf以及需要写入的字节数aio_nbytes。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>struct aiocb {</span></span>
<span class="line"><span>   int       aio_fildes;       /* File descriptor */</span></span>
<span class="line"><span>   off_t     aio_offset;       /* File offset */</span></span>
<span class="line"><span>   volatile void  *aio_buf;     /* Location of buffer */</span></span>
<span class="line"><span>   size_t    aio_nbytes;       /* Length of transfer */</span></span>
<span class="line"><span>   int       aio_reqprio;      /* Request priority offset */</span></span>
<span class="line"><span>   struct sigevent    aio_sigevent;     /* Signal number and value */</span></span>
<span class="line"><span>   int       aio_lio_opcode;       /* Operation to be performed */</span></span>
<span class="line"><span>};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们用了一个0xfa的缓冲区，这在后面的演示中可以看到结果。</p><p>30-34行向系统内核申请了这个异步写操作，并且在37-39行查询异步动作的结果，当其结束时在42-48行判断写入的结果是否正确。</p><p>紧接着，我们使用了aio_read从文件中读取这些数据。为此，我们准备了一个新的aiocb结构体，告诉内核需要把数据拷贝到buffer这个缓冲区中，和异步写一样，发起异步读之后在第65-67行一直查询异步读动作的结果。</p><p>接下来运行这个程序，我们看到屏幕上打印出一系列的字符，显示了这个操作是有内核在后台帮我们完成的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>./aio01</span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>writing... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Reading... </span></span>
<span class="line"><span>Success.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打开/tmp目录下的aio_test_xxxx文件，可以看到，这个文件成功写入了我们期望的数据。<br><br><img src="https://static001.geekbang.org/resource/image/27/90/2759999db41b8b4e7c493f7513c75890.png" alt=""><br><br> 请注意，以上的读写，都不需要我们在应用程序里再发起调用，系统内核直接帮我们做好了。</p><h2 id="linux下socket套接字的异步支持" tabindex="-1"><a class="header-anchor" href="#linux下socket套接字的异步支持"><span>Linux下socket套接字的异步支持</span></a></h2><p>aio系列函数是由POSIX定义的异步操作接口，可惜的是，Linux下的aio操作，不是真正的操作系统级别支持的，它只是由GNU libc库函数在用户空间借由pthread方式实现的，而且仅仅针对磁盘类I/O，套接字I/O不支持。</p><p>也有很多Linux的开发者尝试在操作系统内核中直接支持aio，例如一个叫做Ben LaHaise的人，就将aio实现成功merge到2.5.32中，这部分能力是作为patch存在的，但是，它依旧不支持套接字。</p><p>Solaris倒是有真正的系统系别的aio，不过还不是很确定它在套接字上的性能表现，特别是和磁盘I/O相比效果如何。</p><p>综合以上结论就是，Linux下对异步操作的支持非常有限，这也是为什么使用epoll等多路分发技术加上非阻塞I/O来解决Linux下高并发高性能网络I/O问题的根本原因。</p><h2 id="windows下的iocp和proactor模式" tabindex="-1"><a class="header-anchor" href="#windows下的iocp和proactor模式"><span>Windows下的IOCP和Proactor模式</span></a></h2><p>和Linux不同，Windows下实现了一套完整的支持套接字的异步编程接口，这套接口一般被叫做IOCompletetionPort(IOCP)。</p><p>这样，就产生了基于IOCP的所谓Proactor模式。</p><p>和Reactor模式一样，Proactor模式也存在一个无限循环运行的event loop线程，但是不同于Reactor模式，这个线程并不负责处理I/O调用，它只是负责在对应的read、write操作完成的情况下，分发完成事件到不同的处理函数。</p><p>这里举一个HTTP服务请求的例子来说明：</p><ol><li>客户端发起一个GET请求；</li><li>这个GET请求对应的字节流被内核读取完成，内核将这个完成事件放置到一个队列中；</li><li>event loop线程，也就是Poractor从这个队列里获取事件，根据事件类型，分发到不同的处理函数上，比如一个http handle的onMessage解析函数；</li><li>HTTP request解析函数完成报文解析；</li><li>业务逻辑处理，比如读取数据库的记录；</li><li>业务逻辑处理完成，开始encode，完成之后，发起一个异步写操作；</li><li>这个异步写操作被内核执行，完成之后这个异步写操作被放置到内核的队列中；</li><li>Proactor线程获取这个完成事件，分发到HTTP handler的onWriteCompled方法执行。</li></ol><p>从这个例子可以看出，由于系统内核提供了真正的“异步”操作，Proactor不会再像Reactor一样，每次感知事件后再调用read、write方法完成数据的读写，它只负责感知事件完成，并由对应的handler发起异步读写请求，I/O读写操作本身是由系统内核完成的。和前面看到的aio的例子一样，这里需要传入数据缓冲区的地址等信息，这样，系统内核才可以自动帮我们把数据的读写工作完成。</p><p>无论是Reactor模式，还是Proactor模式，都是一种基于事件分发的网络编程模式。<strong>Reactor模式是基于待完成的I/O事件，而Proactor模式则是基于已完成的I/O事件</strong>，两者的本质，都是借由事件分发的思想，设计出可兼容、可扩展、接口友好的一套程序框架。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>和同步I/O相比，异步I/O的读写动作由内核自动完成，不过，在Linux下目前仅仅支持简单的基于本地文件的aio异步操作，这也使得我们在编写高性能网络程序时，首选Reactor模式，借助epoll这样的I/O分发技术完成开发；而Windows下的IOCP则是一种异步I/O的技术，并由此产生了和Reactor齐名的Proactor模式，借助这种模式，可以完成Windows下高性能网络程序设计。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>和往常一样，给你布置两道思考题：</p><ol><li>你可以查一查Linux的资料，看看为了在内核层面支持完全的异步I/O，Linux的世界里都发生了什么？</li><li>在例子程序里，aio_error一直处于占用CPU轮询异步操作的状态，有没有别的方法可以改进一下，比如挂起调用者、设置超时时间等？</li></ol><p>欢迎你在评论区写下你的思考，也欢迎把这篇文章分享给你的朋友或者同事，一起交流进步一下。</p>`,51)]))}const t=s(p,[["render",l]]),o=JSON.parse('{"path":"/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/30%20_%20%E7%9C%9F%E6%AD%A3%E7%9A%84%E5%A4%A7%E6%9D%80%E5%99%A8%EF%BC%9A%E5%BC%82%E6%AD%A5I_O%E6%8E%A2%E7%B4%A2.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是盛延敏，这里是网络编程实战的第30讲，欢迎回来。 在性能篇的前几讲中，我们谈到了阻塞I/O、非阻塞I/O以及像select、poll、epoll等I/O多路复用技术，并在此基础上结合线程技术，实现了以事件分发为核心的reactor反应堆模式。你或许还听说过一个叫做Proactor的网络事件驱动模式，这个Proactor模式和reactor模式...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%AE%9E%E6%88%98/%E7%AC%AC%E4%B8%89%E6%A8%A1%E5%9D%97%EF%BC%9A%E6%80%A7%E8%83%BD%E7%AF%87/30%20_%20%E7%9C%9F%E6%AD%A3%E7%9A%84%E5%A4%A7%E6%9D%80%E5%99%A8%EF%BC%9A%E5%BC%82%E6%AD%A5I_O%E6%8E%A2%E7%B4%A2.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是盛延敏，这里是网络编程实战的第30讲，欢迎回来。 在性能篇的前几讲中，我们谈到了阻塞I/O、非阻塞I/O以及像select、poll、epoll等I/O多路复用技术，并在此基础上结合线程技术，实现了以事件分发为核心的reactor反应堆模式。你或许还听说过一个叫做Proactor的网络事件驱动模式，这个Proactor模式和reactor模式..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":11.11,"words":3334},"filePathRelative":"posts/网络编程实战/第三模块：性能篇/30 _ 真正的大杀器：异步I_O探索.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"30 | 真正的大杀器：异步I/O探索\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/f6/b8/f61c70e6b027c27fd79b1ce51b6007b8.mp3\\"></audio></p>\\n<p>你好，我是盛延敏，这里是网络编程实战的第30讲，欢迎回来。</p>\\n<p>在性能篇的前几讲中，我们谈到了阻塞I/O、非阻塞I/O以及像select、poll、epoll等I/O多路复用技术，并在此基础上结合线程技术，实现了以事件分发为核心的reactor反应堆模式。你或许还听说过一个叫做Proactor的网络事件驱动模式，这个Proactor模式和reactor模式到底有什么区别和联系呢？在今天的内容中，我们先讲述异步I/O，再一起揭开以异步I/O为基础的proactor模式的面纱。</p>","autoDesc":true}');export{t as comp,o as data};
