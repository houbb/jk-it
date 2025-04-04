# 06 _ WebRTC中的RTP及RTCP详解

<audio id="audio" title="06 | WebRTC中的RTP及RTCP详解" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/be/bc/be80fd25a444283071c6a416c3cee1bc.mp3"></audio>

可以毫不夸张地说，WebRTC 是一个 “**宝库**”，它里面有各种各样的 “**好东西**”。无论你从事什么行业，几乎都可以从它里边吸取能量。

在学习 WebRTC 时，你不光要学习如何使用它，还应该多去看它底层的代码，多去了解它都能做些什么，争取对它的原理和使用都了然于心。如此一来，当遇到某个恰当的时机，你就可以从 WebRTC 库中抽取一点“精髓”放到你自己的项目中，让你的项目大放异彩。

比如，你是搞音频的，你就可以从 WebRTC 中提取 3A（AEC、AGC、ANC）的算法用到自己的项目中，这些算法可是目前世界上最顶级处理音频的算法；如果你是搞网络的，网络带宽的评估、平滑处理、各种网络协议的实现在WebRTC中真是应有尽有，你完全可以从中抽取你想用的。

鉴于WebRTC的强大“光环”，所以本文我将向你讲解学习WebRTC时你不得不知道的几个与网络相关的基本知识，让你在前期就能夯实基础。

## UDP还是TCP？

如果抛开 WebRTC，让你自己实现一套**实时互动**直播系统，在选择网络传输协议时，你会选择使用**UDP**协议还是**TCP**协议呢？

这个问题在2011年至2012年一直是一件困扰着我们整个团队的大事儿，因为当时在国内很少有用 UDP 作为底层传输协议的。UDP虽然传输快，但不可靠，尤其是在用户的网络质量很差的情况下，基本无法保障音视频的服务质量。

当时能想到的解决方案是，如果采用 UDP 作为底层传输协议，那就使用 RUDP（可靠性 UDP），只有这样才能保障传输过程中不丢包。但有人提出反对意见，认为如果想不丢包，就该使用 TCP，因为 RUDP 可靠性做到极致就变成TCP了，那为什么不直接使用 TCP 呢？

面对这种情况，2019年的你会做何种选择呢？UDP还是TCP？你能拿出让人真正信服的理由吗？

现在让我告诉你正确答案：**必须使用UDP，必须使用UDP，必须使用UDP**，重要的事情说三遍。

为什么一定要使用UDP呢？关于这个问题，你可以反向思考下，假如使用TCP会怎样呢？在极端网络情况下，TCP 为了传输的可靠性，它是如何做的呢？简单总结起来就是**“发送-&gt;确认；超时-&gt;重发”的反复过程**。

举个例子，A 与 B 通讯，A 首先向 B 发送数据，并启动一个**定时器**。当 B 收到 A 的数据后，B 需要给 A 回一个**ACK（确认）**消息，反复这样操作，数据就源源不断地从 A 流向了 B。如果因为某些原因，A一直收不到 B 的确认消息会怎么办呢？当 A 的定时器超时后，A 将重发之前没有被确认的消息，并重新设置定时器。

在TCP协议中，为了避免重传次数过多，定时器的超时时间会按 **2 的指数增长**。也就是说，假设第一次设置的超时时间是1秒，那么第二次就是 2 秒，第三次是 4秒……第七次是 64 秒。**如果第七次之后仍然超时，则断开TCP连接**。你可以计算一下，从第一次超时，到最后断开连接，这之间一共经历了 2 分 07 秒，是不是很恐怖？

如果遇到前面的情况，A与B之间的连接断了，那还算是个不错的情况，因为还可以再重新建立连接。但如果在第七次重传后，A 收到了 B 的 ACK 消息，那么A 与 B 之间的数据传输的延迟就达到 1 分钟以上。对于这样的延迟，实时互动的直播系统是根本无法接受的。

基于以上的原因，在实现**实时互动直播系统的时候你必须使用UDP协议**。

## RTP/RTCP

一般情况下，在实时互动直播系统传输音视频数据流时，我们并不直接将音视频数据流交给 UDP传输，而是先给音视频数据加个 **RTP 头**，然后再交给 UDP 进行传输。为什么要这样做呢？

我们以视频帧为例，一个 I 帧的数据量是非常大的，最少也要几十K（I/P/B帧的概念我在前面[《03 | 如何使用浏览器给自己拍照呢?》](https://time.geekbang.org/column/article/109065)的文章中有过介绍）。而以太网的最大传输单元是多少呢？ 1.5K，所以要传输一个I帧需要几十个包。并且这几十个包传到对端后，还要重新组装成I帧，这样才能进行解码还原出一幅幅的图像。如果是我们自己实现的话，要完成这样的过程，至少需要以下几个标识。

- **序号**：用于标识传输包的序号，这样就可以知道这个包是第几个分片了。
- **起始标记**：记录分帧的第一个UDP包。
- **结束标记**：记录分帧的最后一个UDP包。

有了上面这几个标识字段，我们就可以在发送端进行拆包，在接收端将视频帧重新再组装起来了。

### 1. RTP 协议

其实，这样的需求在很早之前就已经有了。因此，人们专门定义了一套规范，它就是**RTP**协议。下面让我们来详细看一下 RTP 协议吧。

<img src="https://static001.geekbang.org/resource/image/ae/89/aec03cf4e1b76296c3e21ebbc54a2289.png" alt="">

如图所示，RTP 协议非常简单，我这里按字段的重要性从高往低的顺序讲解一下。

- **sequence number**：序号，用于记录包的顺序。这与上面我们自己实现拆包、组包是同样的道理。
- **timestamp**：时间戳，同一个帧的不同分片的时间戳是相同的。这样就省去了前面所讲的**起始标记**和**结束标记**。一定要记住，**不同帧的时间戳肯定是不一样的**。
- **PT**：Payload Type，数据的负载类型。音频流的 PT 值与视频的 PT 值是不同的，通过它就可以知道这个包存放的是什么类型的数据。
- ……

这里，我并没有将RTP协议头中的所有字段的详细说明都列在这儿，如果你想了解所有字段的含义，可以到参考一节查看其他字段的含义。需要注意的是，这里没有将它们列出来并不代表它们不重要。恰恰相反，**如果你想做音视频传输相关的工作，RTP头中的每个字段的含义你都必须全部清楚**。

知道了上面这些字段的含义后，下面我们还是来看一个具体的例子吧！假设你从网上接收到一组音视频数据，如下：

```
...

{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:13,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:14,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:14,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:15,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:15,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:16,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:16,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:17,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:17,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:18,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:18,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:19,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=0,PT:98,seq:19,ts:1122334455,ssrc=2345},
{V=2,P=0,X=0,CC=0,M=0,PT:111,seq:20,ts:1122334455,ssrc=888},
{V=2,P=0,X=0,CC=0,M=1,PT:98,seq:20,ts:1122334455,ssrc=2345},
...

```

假设 PT=98 是视频数据，PT=111 是音频数据，那么按照上面的规则你是不是很容易就能将视频帧组装起来呢？

### 2. RTCP 协议

在使用 RTP 包传输数据时，难免会发生丢包、乱序、抖动等问题，下面我们来看一下使用的网络一般都会在什么情况下出现问题：

- 网络线路质量问题引起丢包率高；
- 传输的数据超过了带宽的负载引起的丢包问题；
- 信号干扰（信号弱）引起的丢包问题；
- 跨运营商引入的丢包问题;
- ……

WebRTC 对这些问题在底层都有相应的处理策略，但在处理这些问题之前，它首先要让各端都知道它们自己的网络质量到底是怎样的，**这就是 RTCP 的作用**。

**RTCP 有两个最重要的报文：RR（Reciever Report）和 SR(Sender Report)。通过这两个报文的交换，各端就知道自己的网络质量到底如何了。**

RTCP 支持的所有报文及其含义可以查看文章最后所附的参考一节。这里我们以**SR报文**为例，看看 SR 报文中都包括哪些信息。

<img src="https://static001.geekbang.org/resource/image/ae/f3/ae1b83a0255d05dd70285f0a26fb23f3.png" alt="">

下面我就简要说明一下该报文中字段的含义：

- V=2，指报文的版本。
- P，表示填充位，如果该位置1，则在 RTCP 报文的最后会有填充字节（内容是按字节对齐的）。
- RC，全称Report Count，指RTCP 报文中接收报告的报文块个数。
- PT=200，Payload Type，也就是说SR 的值为 200。
- ……

与RTP协议头一样，上面只介绍了RTCP头字段的含义，至于其他每个字段的含义请查看参考一节。同样的，对于 RTCP 头中的每个字段也必须都非常清楚，只有这样以后你在看 WebRTC 带宽评估相关的代码时，才不至于晕头转向。

从上图中我们可以了解到，SR报文分成三部分：**Header、Sender info**和**Report block**。在NTP 时间戳之上的部分为 SR 报文的 **Header** 部分，SSRC_1字段之上到 Header之间的部分为 **Sender info** 部分，剩下的就是一个一个的Report Block了。那这每一部分是用于干什么的呢？

- Header 部分用于标识该报文的类型，比如是SR还是RR。
- Sender info 部分用于指明作为发送方，到底发了多少包。
- Report block 部分指明发送方作为接收方时，它从各个 SSRC 接收包的情况。

通过以上的分析，你可以发现**SR报文**并不仅是指发送方发了多少数据，它还报告了作为接收方，它接收到的数据的情况。当发送端收到对端的接收报告时，它就可以根据接收报告来评估它与对端之间的网络质量了，随后再根据网络质量做传输策略的调整。

**SR报文**与**RR报文**无疑是 RTCP 协议中最重要的两个报文，不过RTCP中的其他报文也都非常重要的，如果你想学好 WebRTC ，那么 RTCP 中的每个报文你都必须掌握。

比如，RTCP 类型为 206、子类型为 4 的 FIR 报文，其含义是 Full Intra Request (FIR) Command，即**完整帧请求**命令。它起什么作用？又在什么时候使用呢？

该报文也是一个特别关键的报文，我为什么这么说呢？试想一下，在一个房间里有 3 个人进行音视频聊天，然后又有一个人加入到房间里，这时如果不做任何处理的话，那么第四个人进入到房间后，在一段时间内很难直接看到其他三个人的视频画面了，这是为什么呢？

原因就在于解码器在解码时有一个上下文。在该上下文中，必须先拿到一个 IDR 帧之后才能将其后面的P帧、B帧进行解码。也就是说，在没有 IDR 帧的情况下，对于收到的P帧、B 帧解码器只能干瞪眼了。

如何解决这个问题呢？这就引出了 FIR 报文。当第四个人加入到房间后，它首先发送 FIR 报文，当其他端收到该报文后，便立即产生各自的IDR帧发送给新加入的人，这样当新加入的人拿到房间中其他的IDR帧后，它的解码器就会解码成功，于是其他人的画面也就一下子全部展示出来了。所以你说它是不是很重要呢？

## 小结

通过上面的介绍想必你应该已经对 RTP/ RTCP 有了比较深刻的认识了。实际上，在 WebRTC 中还可以对 RTCP 做许多精确的控制，比如是否支持 FIR、NACK，以及SR和RR 的发送间隔等，这些都是可以控制的，这些我会在下一篇SDP 相关的文章中再向你做更详细的介绍。

在 WebRTC 中， RTP/RTCP 只是众多协议中的比较重要的两个，还有 SRTP/SRTCP、DTLS、STUN/TURN协议等。有些知识我会在后面的文章中给你介绍，还有一些并不会讲到，但没有讲到的并不代表它不重要，只是与我们讲的主题稍远被裁掉而已，对于这些知识就需要你自己去研究学习了。

## 思考时间

RTCP 与 RTP 协议相辅相成，RTCP 会将 RTP 的丢包情况及时反馈给发送方，但如果是报告反馈情况的 RTCP 数据包丢失了会怎样呢？

欢迎在留言区与我分享你的想法，也欢迎你在留言区记录你的思考过程。感谢阅读，如果你觉得这篇文章对你有帮助的话，也欢迎把它分享给更多的朋友。

## 参考

RTP协议头：<br/>
<img src="https://static001.geekbang.org/resource/image/e2/8f/e21ea8be9c0d13638a6af38423640d8f.png" alt="">

RTCP 协议头：<br/>
<img src="https://static001.geekbang.org/resource/image/1e/04/1e772dd266c0899799dad777339adc04.png" alt="">

RTCP PT 类型：<br/>
<img src="https://static001.geekbang.org/resource/image/cd/78/cd6ccdd0d30541d9b59fd5ff5d216178.png" alt="">

对于 205 和 206 两种不同的反馈消息，又在 RFC5104 中做了更详细的定义：<br/>
<img src="https://static001.geekbang.org/resource/image/f4/ee/f4aeb8f448798523960756678c35fbee.png" alt="">


