import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as p}from"./app-CrA-f6So.js";const i={};function l(r,s){return p(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_07-websocket接口-如何测试一个完全陌生的协议接口" tabindex="-1"><a class="header-anchor" href="#_07-websocket接口-如何测试一个完全陌生的协议接口"><span>07 _ WebSocket接口：如何测试一个完全陌生的协议接口？</span></a></h1><p><audio id="audio" title="07 | WebSocket接口：如何测试一个完全陌生的协议接口？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/8c/fb/8cd3f08efe6d3b418ae85932636767fb.mp3"></audio></p><p>你好，我是陈磊。很高兴你又来和我一起探寻接口测试的奥秘了。</p><p>我们在前面一起学习了怎么分析和完成一个HTTP协议的接口测试，又一起学习了如何封装接口测试框架，以及如何搭建接口测试平台。我相信，现在你已经完全掌握了HTTP协议的接口测试了。</p><p>但是，这还不能说明你已经能独立完成接口测试了，为什么这么说呢？这是因为数据在网络传输上都是依靠一种协议来完成的，在上学的时候，你肯定学过包括TCP、UDP、HTTP等在内的一堆协议，但是如果你遇见了一个全新的协议，你知道怎么从零开始，完成接口测试吗？</p><p>今天我就以WebSocket为例，告诉你当你第一次接触一个完全陌生的协议接口时，你要如何开始完成接口测试工作。</p><h2 id="未知的新协议接口并不可怕" tabindex="-1"><a class="header-anchor" href="#未知的新协议接口并不可怕"><span>未知的新协议接口并不可怕</span></a></h2><p>作为一名测试工程师，在面对一个陌生协议的接口测试时，你是不是会常常感到很无助？面对这样的任务时，你的第一反应肯定是向开发工程师求助，因为开发工程师基于新协议已经完成了接口开发，向开发工程师求助显然是最好的办法。</p><p>我在工作中就遇见过类似的事情。记得那是在我参加工作的前几年，有一个被测项目的接口是一个私有协议，当我看到接口文档的时候，第一反应就是找开发工程师，向他求教一下这个私有协议。这个开发工程师人很好，他给了我一个学习脉络，其中包含了协议的说明文档、代码开发文档、实现代码等内容，我拿到这些资料后，马上按照上面他给出的学习顺序投入学习。</p><p>但是后来，在项目从交付测试到完成测试后，我发现自己走了一个弯路。因为作为测试工程师，我们不需要了解协议底层的原理，只需要了解新协议是如何传输数据，又如何返回数据库就可以了。也就是说，我们要想模拟一个客户端去验证服务端的逻辑，那么开始接口测试最快速的方法不是去看协议的说明文档，而是直接去看开发实现的客户端代码，这对于我们来说，能更直接地解决问题。但这也并不是说，那位开发工程师告诉我的学习脉络是错误的，只不过它并不是一个非常适合测试工程师的学习方法。</p><p>那在面对一个陌生的新协议时，测试工程师的首要任务是什么呢？</p><p>**在我看来，就是要测试接口的正确逻辑、错误逻辑是否满足最初的需求，因此，我们需要快速地掌握验证手段。**在时间紧迫的情况下，如果我们还是先学习新协议的基础知识，再学习怎么使用它，就无疑压榨了测试的工期，也会让我们在真正开始工作时手忙脚乱。</p><p>所以，我们要从解决实际问题的角度出发，直接拿到开发工程师提供的调用客户端代码，这样我们就可以快速完成工作了；在完成工作的后续时间里，我们也可以慢慢补充基础知识。这里需要你注意的是，我并不是说基础知识不重要，而是说在项目进行过程中，学习基础知识很多时候没有完成项目的质量保障工作重要。</p><h2 id="第一次接触websocket接口" tabindex="-1"><a class="header-anchor" href="#第一次接触websocket接口"><span>第一次接触WebSocket接口</span></a></h2><p>我在前面说了一大堆方法论，你看到后可能还是摸不到头脑，那么现在，我就以一个我亲身经历的例子来告诉你，面对一个陌生协议接口要怎么去做测试。</p><p>大概是在2017年，我第一次接触到WebSocket协议的接口，当开发工程师告诉我这是一个WebSocket的接口时，我一脸懵，完全不知道要如何开始测试它。</p><p>我先做的就是和开发要了他们调用方的代码，当我第一次看到这个代码时，还是很难为情的，因为它是用Node.js编写的，当时我对这个技术知之甚少。但凭着自己的经验积累，我多多少少还能看懂一点这个代码，然而我在读了代码之后，发现自己基于这个代码写测试用例并不容易，因为我对Node.js技术实在太陌生了，陌生到我无法利用它来完成接口测试。</p><p>这种情况我相信你肯定也遇见过，那就是开发工程师很Nice地把代码给了你，但你却没办法利用它。但这里我想告诉你的是，面对一个陌生协议的接口测试任务时，无论如何，第一次你还是需要先拿到并了解开发工程师写的客户端代码，因为这样，你就可以对调用方式、参数等接口相关的一些内容有初步印象。在读完相关代码后，你就算是和这些接口完成了首次“会面”，下面你就要想办法敲开接口的大门，让自己能访问被测接口。</p><p>由于技术栈问题，我没办法借助开发工程师的力量完成接口测试任务，因此我接下来想到的是，借助一些自己已经熟悉的工具来完成本次测试。我第一个想到的就是我们在之前课程中一起使用过的Fiddler，因为在任何一个接口项目开始时，无论开发是不是给了我接口文档，我都会先用Fiddler访问看一下。</p><p>那么WebSocket用Fiddler怎么搞定？我当时搜索了一下，还真是有办法，具体的办法我就不在这里多说了，其实主要就是修改了Fiddler中Rules下的Customize Rules，如果你感兴趣可以自己去搜一下。我只是想告诉你，当你面对陌生技术问题的时候，你应该使用你最熟悉的技术去尝试解决问题。</p><p>但从下面的图中你可以看到，虽然我找到了Fiddler截获WebSocket接口的办法，却不难发现，所截获的全部消息都在日志里面，根本无法操作，所以我想用Fiddler完成WebSocket测试的想法也就胎死腹中了。</p><img src="https://static001.geekbang.org/resource/image/28/c5/28455a0b055a49b69f30963c1d3cf8c5.png" alt=""><p>但是，我可以借助Fiddler分析WebSocket的接口，这也和我们一开始给Fiddler这款工具的定位一样，那就是通过它辅助分析我们的被测接口。</p><h2 id="自己写websocket测试代码" tabindex="-1"><a class="header-anchor" href="#自己写websocket测试代码"><span>自己写WebSocket测试代码</span></a></h2><p>当用已有工具基础解决WebSocket接口测试这个想法破灭了后，我开始寻求通过编写代码，解决WebSocket的接口测试。在这里，我还是建议你要以你自己的技术栈为出发点，寻找解决问题的方法。由于我的主要编程语言是Python，因此下面一些讲解的示例代码段，我还是以Python为例，但是你要知道，解决问题的思路并不限于Python的编程语言，它可以是你使用的任何其它语言。</p><p>我发现Python提供了WebSocket的协议库，因此我只要用它完成客户端的撰写，就可以进行接口测试了。这里，我写下了第一个WebSocket的调用代码（这里我们以 <a href="http://www.websocket.org/demos/echo/" target="_blank" rel="noopener noreferrer">http://www.websocket.org/demos/echo/</a> 为例)，如下面图中所示，我在代码里面写了详细的注释，你肯定能看懂每一句话的意思。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#引入websocket的create_connection类</span></span>
<span class="line"><span>from websocket import create_connection</span></span>
<span class="line"><span># 建立和WebSocket接口的链接</span></span>
<span class="line"><span>ws = create_connection(&amp;quot;ws://echo.websocket.org&amp;quot;)</span></span>
<span class="line"><span># 打印日子</span></span>
<span class="line"><span>print(&amp;quot;发送 &#39;Hello, World&#39;...&amp;quot;)</span></span>
<span class="line"><span># 发送Hello，World</span></span>
<span class="line"><span>ws.send(&amp;quot;Hello, World&amp;quot;)</span></span>
<span class="line"><span># 将WebSocket的返回值存储result变量</span></span>
<span class="line"><span>result = ws.recv()</span></span>
<span class="line"><span># 打印返回的result</span></span>
<span class="line"><span>print(&amp;quot;返回&amp;quot;+result)</span></span>
<span class="line"><span># 关闭WebSocket链接</span></span>
<span class="line"><span>ws.close()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不知道你发现没有，上面的代码和HTTP协议的接口类似，都是先和一个请求建立连接，然后发送信息。它们的区别是，WebSocket是一个长连接，因此需要人为的建立连接，然后再关闭链接，而HTTP却并不需要进行这一操作。</p><p>我相信你肯定还记得在测试框架那一节（<a href="https://time.geekbang.org/column/article/195483" target="_blank" rel="noopener noreferrer">04</a>）中，我们学习了一些线性的接口测试代码，然后通过分析这些代码抽象出Common类，随着Common类的不断丰富，就形成了你自己私有化的测试框架，那么现在问题来了：Common类中可以也放入WebSocket的通用方法吗？</p><h2 id="将websocket接口封装进你的框架" tabindex="-1"><a class="header-anchor" href="#将websocket接口封装进你的框架"><span>将WebSocket接口封装进你的框架</span></a></h2><p>看见上面的代码，我们的第一反应应该是，这里有什么东西可以放到我们自己的Common类中呢？你可以按照“测试代码即框架”这一思路将这个WebSocket接口封装进你的框架。</p><p>我们在前面课程中封装了Common类，你可以在它的构造函数中，添加一个API类型的参数，以便于知道自己要做的是什么协议的接口，其中http代表HTTP协议接口，ws代表WebSocket协议接口。由于WebSocket是一个长连接，我们在Common类析构函数中添加了关闭ws链接的代码，以释放WebSocket长连接。依据前面的交互流程，实现代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#!/usr/bin/env python</span></span>
<span class="line"><span># -*- coding: utf-8 -*-</span></span>
<span class="line"><span># python代码中引入requests库，引入后才可以在你的代码中使用对应的类以及成员函数</span></span>
<span class="line"><span>import requests</span></span>
<span class="line"><span>from websocket import create_connection</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 定义一个common的类，它的父类是object</span></span>
<span class="line"><span>class Common(object):</span></span>
<span class="line"><span>  # common的构造函数</span></span>
<span class="line"><span>  def __init__(self,url_root,api_type):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    :param api_type:接口类似当前支持http、ws，http就是HTTP协议，ws是WebSocket协议  </span></span>
<span class="line"><span>    :param url_root: 被测系统的根路由   </span></span>
<span class="line"><span>    &#39;&#39;&#39;    </span></span>
<span class="line"><span>    if api_type==&#39;ws&#39;:</span></span>
<span class="line"><span>      self.ws = create_connection(url_root)</span></span>
<span class="line"><span>    elif api_type==&#39;http&#39;:</span></span>
<span class="line"><span>      self.ws=&#39;null&#39;</span></span>
<span class="line"><span>      self.url_root = url_root</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # ws协议的消息发送</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  def send(self,params):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    :param params: websocket接口的参数</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    :return: 访问接口的返回值</span></span>
<span class="line"><span>    &#39;&#39;&#39; </span></span>
<span class="line"><span>    self.ws.send(params)</span></span>
<span class="line"><span>    res = self.ws.recv()</span></span>
<span class="line"><span>    return res</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # common类的析构函数，清理没有用的资源</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  def __del__(self):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    :return:</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    if self.ws!=&#39;null&amp;quot;:</span></span>
<span class="line"><span>       self.ws.close()</span></span>
<span class="line"><span>  def get(self, uri, params=None):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    封装你自己的get请求，uri是访问路由，params是get请求的参数，如果没有默认为空 </span></span>
<span class="line"><span>    :param uri: 访问路由 </span></span>
<span class="line"><span>    :param params: 传递参数，string类型，默认为None </span></span>
<span class="line"><span>    :return: 此次访问的response</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    # 拼凑访问地址</span></span>
<span class="line"><span>    if params is not None:</span></span>
<span class="line"><span>      url = self.url_root + uri + params</span></span>
<span class="line"><span>    else:    </span></span>
<span class="line"><span>      url = self.url_root + uri</span></span>
<span class="line"><span>    # 通过get请求访问对应地址</span></span>
<span class="line"><span>    res = requests.get(url)</span></span>
<span class="line"><span>    # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>    return res</span></span>
<span class="line"><span>  def post(self, uri, params=None):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    封装你自己的post方法，uri是访问路由，params是post请求需要传递的参数，如果没有参数这里为空</span></span>
<span class="line"><span>    :param uri: 访问路由</span></span>
<span class="line"><span>    :param params: 传递参数，string类型，默认为None</span></span>
<span class="line"><span>    :return: 此次访问的response</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    # 拼凑访问地址</span></span>
<span class="line"><span>    url = self.url_root + uri</span></span>
<span class="line"><span>    if params is not None:</span></span>
<span class="line"><span>       # 如果有参数，那么通过post方式访问对应的url，并将参数赋值给requests.post默认参数data</span></span>
<span class="line"><span>      # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>      res = requests.post(url, data=params)</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      # 如果无参数，访问方式如下</span></span>
<span class="line"><span>      # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>      res = requests.post(url)    </span></span>
<span class="line"><span>    return res</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  def put(self,uri,params=None):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    封装你自己的put方法，uri是访问路由，params是put请求需要传递的参数，如果没有参数这里为空</span></span>
<span class="line"><span>    :param uri: 访问路由</span></span>
<span class="line"><span>    :param params: 传递参数，string类型，默认为None</span></span>
<span class="line"><span>    :return: 此次访问的response</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    url = self.url_root+uri</span></span>
<span class="line"><span>    if params is not None:</span></span>
<span class="line"><span>      # 如果有参数，那么通过put方式访问对应的url，并将参数赋值给requests.put默认参数data</span></span>
<span class="line"><span>      # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>      res = requests.put(url, data=params)</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      # 如果无参数，访问方式如下</span></span>
<span class="line"><span>      # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>      res = requests.put(url)</span></span>
<span class="line"><span>    return res</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  def delete(self,uri,params=None):</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    封装你自己的delete方法，uri是访问路由，params是delete请求需要传递的参数，如果没有参数这里为空</span></span>
<span class="line"><span>    :param uri: 访问路由</span></span>
<span class="line"><span>    :param params: 传递参数，string类型，默认为None</span></span>
<span class="line"><span>    :return: 此次访问的response</span></span>
<span class="line"><span>    &#39;&#39;&#39;</span></span>
<span class="line"><span>    url = self.url_root + uri</span></span>
<span class="line"><span>    if params is not None:</span></span>
<span class="line"><span>      # 如果有参数，那么通过put方式访问对应的url，并将参数赋值给requests.put默认参数data</span></span>
<span class="line"><span>      # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>      res = requests.delete(url, data=params)</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      # 如果无参数，访问方式如下</span></span>
<span class="line"><span>      # 返回request的Response结果，类型为requests的Response类型</span></span>
<span class="line"><span>      res = requests.put(url)</span></span>
<span class="line"><span>    return res</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码很长，但我的注释很详细，我并不建议你一字不落地都看完，你只要在使用的时候看一下对应的方法就好了。它是一个超级工具集合，最后会变成你自己的类似哆啦A梦的万能口袋，你只要做好自己的积累就可以了。</p><p>那么，使用上述的Common类将上面那个流水账一样的脚本进行改造后，就得出了下面这段代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>from common import Common</span></span>
<span class="line"><span># 建立和WebSocket接口的链接</span></span>
<span class="line"><span>con = Common(&#39;ws://echo.websocket.org&#39;,&#39;ws&#39;)</span></span>
<span class="line"><span># 获取返回结果</span></span>
<span class="line"><span>result = con.send(&#39;Hello, World...&#39;)</span></span>
<span class="line"><span>#打印日志</span></span>
<span class="line"><span>print(result)</span></span>
<span class="line"><span>#释放WebSocket的长连接</span></span>
<span class="line"><span>del con</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，从改造后的代码中，你是不是更能体会到框架的魅力了？它能让代码变得更加简洁和易读，将WebSocket的协议封装到你的框架后，你就拥有了一个既包含HTTP协议又包含WebSocket协议的接口测试框架了，随着你不断地积累新协议，你的框架会越来越强大，你自己的秘密武器库也会不断扩充，随着你对它的不断完善，它会让你的接口测试工作越来越简单，越来越快速。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>美好的时光过得都很快，又到了本节课结束的时候了，我今天主要讲了面对一个陌生协议时（比如说WebSocket），你该如何从零开始完成接口测试任务。</p><p>针对一个陌生协议的第一次接口测试，你要保持自己敏锐的测试嗅觉，依据自己的技术基础，尽快解决问题。总地来说，你可以通过三步快速完成测试任务：</p><ol><li>借力开发工程师。你首先该借力就是开发工程师，但你不要进入开发工程师给你的那种，从技术基础和理论开始学起，再逐步应用的学习脉络。你要一击致命，直接把他的客户端代码拿来，尽最大可能挪为己用，将其变成自己的接口测试代码。</li><li>站在自己的技术栈之上，完成技术积累。如果开发工程师的代码并不能拿来使用，那么你就需要站在自己的技术栈上寻求解决方法，这其中既包含了你已经熟悉的测试工具、测试平台，也包含了自己的测试框架和编码基础。</li><li>归入框架。无论你使用哪一种方法，在完成测试工作后，你还是要掌握对应的理论基础，同时想办法将这个一开始陌生的接口，通过自己熟悉的方式合并到你自己的框架中，不断扩充自己框架的测试能力，不断丰富你自己的测试手段。</li></ol><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>我们今天一起学习了如何破解陌生协议接口测试难题的步骤，那么面对WebSocket的接口测试任务，结合你现有的技术栈，你是不是也有你自己的解决方案呢？你工作中如果有类似的陌生协议（既可以是第一次接触的协议，也可以是企业私有协议），你是如何解决的呢？欢迎你在留言区中留下你的疑问和你的做法。</p><p>我是陈磊，欢迎你在留言区留言分享你的观点，如果这篇文章让你有新的启发，也欢迎你把文章分享给你的朋友，我们一起沟通探讨。</p>`,44)]))}const t=n(i,[["render",l]]),o=JSON.parse('{"path":"/posts/%E6%8E%A5%E5%8F%A3%E6%B5%8B%E8%AF%95%E5%85%A5%E9%97%A8%E8%AF%BE/%E8%BF%9B%E9%98%B6%E6%8A%80%E8%83%BD%E7%AF%87/07%20_%20WebSocket%E6%8E%A5%E5%8F%A3%EF%BC%9A%E5%A6%82%E4%BD%95%E6%B5%8B%E8%AF%95%E4%B8%80%E4%B8%AA%E5%AE%8C%E5%85%A8%E9%99%8C%E7%94%9F%E7%9A%84%E5%8D%8F%E8%AE%AE%E6%8E%A5%E5%8F%A3%EF%BC%9F.html","title":"07 _ WebSocket接口：如何测试一个完全陌生的协议接口？","lang":"zh-CN","frontmatter":{"description":"07 _ WebSocket接口：如何测试一个完全陌生的协议接口？ 你好，我是陈磊。很高兴你又来和我一起探寻接口测试的奥秘了。 我们在前面一起学习了怎么分析和完成一个HTTP协议的接口测试，又一起学习了如何封装接口测试框架，以及如何搭建接口测试平台。我相信，现在你已经完全掌握了HTTP协议的接口测试了。 但是，这还不能说明你已经能独立完成接口测试了，为...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E6%8E%A5%E5%8F%A3%E6%B5%8B%E8%AF%95%E5%85%A5%E9%97%A8%E8%AF%BE/%E8%BF%9B%E9%98%B6%E6%8A%80%E8%83%BD%E7%AF%87/07%20_%20WebSocket%E6%8E%A5%E5%8F%A3%EF%BC%9A%E5%A6%82%E4%BD%95%E6%B5%8B%E8%AF%95%E4%B8%80%E4%B8%AA%E5%AE%8C%E5%85%A8%E9%99%8C%E7%94%9F%E7%9A%84%E5%8D%8F%E8%AE%AE%E6%8E%A5%E5%8F%A3%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"07 _ WebSocket接口：如何测试一个完全陌生的协议接口？"}],["meta",{"property":"og:description","content":"07 _ WebSocket接口：如何测试一个完全陌生的协议接口？ 你好，我是陈磊。很高兴你又来和我一起探寻接口测试的奥秘了。 我们在前面一起学习了怎么分析和完成一个HTTP协议的接口测试，又一起学习了如何封装接口测试框架，以及如何搭建接口测试平台。我相信，现在你已经完全掌握了HTTP协议的接口测试了。 但是，这还不能说明你已经能独立完成接口测试了，为..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"07 _ WebSocket接口：如何测试一个完全陌生的协议接口？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":14.11,"words":4232},"filePathRelative":"posts/接口测试入门课/进阶技能篇/07 _ WebSocket接口：如何测试一个完全陌生的协议接口？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"07 | WebSocket接口：如何测试一个完全陌生的协议接口？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/8c/fb/8cd3f08efe6d3b418ae85932636767fb.mp3\\"></audio></p>\\n<p>你好，我是陈磊。很高兴你又来和我一起探寻接口测试的奥秘了。</p>\\n<p>我们在前面一起学习了怎么分析和完成一个HTTP协议的接口测试，又一起学习了如何封装接口测试框架，以及如何搭建接口测试平台。我相信，现在你已经完全掌握了HTTP协议的接口测试了。</p>","autoDesc":true}');export{t as comp,o as data};
