import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="19 | 理论五：控制反转、依赖反转、依赖注入，这三者有何区别和联系？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/f5/6d/f5869e083ecb4c59597ce8eb8964fa6d.mp3"></audio></p><p>关于SOLID原则，我们已经学过单一职责、开闭、里式替换、接口隔离这四个原则。今天，我们再来学习最后一个原则：依赖反转原则。在前面几节课中，我们讲到，单一职责原则和开闭原则的原理比较简单，但是，想要在实践中用好却比较难。而今天我们要讲到的依赖反转原则正好相反。这个原则用起来比较简单，但概念理解起来比较难。比如，下面这几个问题，你看看能否清晰地回答出来：</p><ul><li>“依赖反转”这个概念指的是“谁跟谁”的“什么依赖”被反转了？“反转”两个字该如何理解？</li><li>我们还经常听到另外两个概念：“控制反转”和“依赖注入”。这两个概念跟“依赖反转”有什么区别和联系呢？它们说的是同一个事情吗？</li><li>如果你熟悉Java语言，那Spring框架中的IOC跟这些概念又有什么关系呢？</li></ul><p>看了刚刚这些问题，你是不是有点懵？别担心，今天我会带你将这些问题彻底搞个清楚。之后再有人问你，你就能轻松应对。话不多说，现在就让我们带着这些问题，正式开始今天的学习吧！</p><h2 id="控制反转-ioc" tabindex="-1"><a class="header-anchor" href="#控制反转-ioc"><span>控制反转（IOC）</span></a></h2><p>在讲“依赖反转原则”之前，我们先讲一讲“控制反转”。控制反转的英文翻译是Inversion Of Control，缩写为IOC。此处我要强调一下，如果你是Java工程师的话，暂时别把这个“IOC”跟Spring框架的IOC联系在一起。关于Spring的IOC，我们待会儿还会讲到。</p><p>我们先通过一个例子来看一下，什么是控制反转。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class UserServiceTest {</span></span>
<span class="line"><span>  public static boolean doTest() {</span></span>
<span class="line"><span>    // ... </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public static void main(String[] args) {//这部分逻辑可以放到框架中</span></span>
<span class="line"><span>    if (doTest()) {</span></span>
<span class="line"><span>      System.out.println(&amp;quot;Test succeed.&amp;quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      System.out.println(&amp;quot;Test failed.&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码中，所有的流程都由程序员来控制。如果我们抽象出一个下面这样一个框架，我们再来看，如何利用框架来实现同样的功能。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public abstract class TestCase {</span></span>
<span class="line"><span>  public void run() {</span></span>
<span class="line"><span>    if (doTest()) {</span></span>
<span class="line"><span>      System.out.println(&amp;quot;Test succeed.&amp;quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      System.out.println(&amp;quot;Test failed.&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public abstract boolean doTest();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JunitApplication {</span></span>
<span class="line"><span>  private static final List&amp;lt;TestCase&amp;gt; testCases = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public static void register(TestCase testCase) {</span></span>
<span class="line"><span>    testCases.add(testCase);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public static final void main(String[] args) {</span></span>
<span class="line"><span>    for (TestCase case: testCases) {</span></span>
<span class="line"><span>      case.run();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>把这个简化版本的测试框架引入到工程中之后，我们只需要在框架预留的扩展点，也就是TestCase类中的doTest()抽象函数中，填充具体的测试代码就可以实现之前的功能了，完全不需要写负责执行流程的main()函数了。 具体的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class UserServiceTest extends TestCase {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public boolean doTest() {</span></span>
<span class="line"><span>    // ... </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 注册操作还可以通过配置的方式来实现，不需要程序员显示调用register()</span></span>
<span class="line"><span>JunitApplication.register(new UserServiceTest();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>刚刚举的这个例子，就是典型的通过框架来实现“控制反转”的例子。框架提供了一个可扩展的代码骨架，用来组装对象、管理整个执行流程。程序员利用框架进行开发的时候，只需要往预留的扩展点上，添加跟自己业务相关的代码，就可以利用框架来驱动整个程序流程的执行。</p><p>这里的“控制”指的是对程序执行流程的控制，而“反转”指的是在没有使用框架之前，程序员自己控制整个程序的执行。在使用框架之后，整个程序的执行流程可以通过框架来控制。流程的控制权从程序员“反转”到了框架。</p><p>实际上，实现控制反转的方法有很多，除了刚才例子中所示的类似于模板设计模式的方法之外，还有马上要讲到的依赖注入等方法，所以，控制反转并不是一种具体的实现技巧，而是一个比较笼统的设计思想，一般用来指导框架层面的设计。</p><h2 id="依赖注入-di" tabindex="-1"><a class="header-anchor" href="#依赖注入-di"><span>依赖注入（DI）</span></a></h2><p>接下来，我们再来看依赖注入。依赖注入跟控制反转恰恰相反，它是一种具体的编码技巧。依赖注入的英文翻译是Dependency Injection，缩写为DI。对于这个概念，有一个非常形象的说法，那就是：依赖注入是一个标价25美元，实际上只值5美分的概念。也就是说，这个概念听起来很“高大上”，实际上，理解、应用起来非常简单。</p><p>那到底什么是依赖注入呢？我们用一句话来概括就是：不通过new()的方式在类内部创建依赖类对象，而是将依赖的类对象在外部创建好之后，通过构造函数、函数参数等方式传递（或注入）给类使用。</p><p>我们还是通过一个例子来解释一下。在这个例子中，Notification类负责消息推送，依赖MessageSender类实现推送商品促销、验证码等消息给用户。我们分别用依赖注入和非依赖注入两种方式来实现一下。具体的实现代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 非依赖注入实现方式</span></span>
<span class="line"><span>public class Notification {</span></span>
<span class="line"><span>  private MessageSender messageSender;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public Notification() {</span></span>
<span class="line"><span>    this.messageSender = new MessageSender(); //此处有点像hardcode</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void sendMessage(String cellphone, String message) {</span></span>
<span class="line"><span>    //...省略校验逻辑等...</span></span>
<span class="line"><span>    this.messageSender.send(cellphone, message);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MessageSender {</span></span>
<span class="line"><span>  public void send(String cellphone, String message) {</span></span>
<span class="line"><span>    //....</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 使用Notification</span></span>
<span class="line"><span>Notification notification = new Notification();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 依赖注入的实现方式</span></span>
<span class="line"><span>public class Notification {</span></span>
<span class="line"><span>  private MessageSender messageSender;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 通过构造函数将messageSender传递进来</span></span>
<span class="line"><span>  public Notification(MessageSender messageSender) {</span></span>
<span class="line"><span>    this.messageSender = messageSender;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void sendMessage(String cellphone, String message) {</span></span>
<span class="line"><span>    //...省略校验逻辑等...</span></span>
<span class="line"><span>    this.messageSender.send(cellphone, message);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//使用Notification</span></span>
<span class="line"><span>MessageSender messageSender = new MessageSender();</span></span>
<span class="line"><span>Notification notification = new Notification(messageSender);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过依赖注入的方式来将依赖的类对象传递进来，这样就提高了代码的扩展性，我们可以灵活地替换依赖的类。这一点在我们之前讲“开闭原则”的时候也提到过。当然，上面代码还有继续优化的空间，我们还可以把MessageSender定义成接口，基于接口而非实现编程。改造后的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Notification {</span></span>
<span class="line"><span>  private MessageSender messageSender;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public Notification(MessageSender messageSender) {</span></span>
<span class="line"><span>    this.messageSender = messageSender;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void sendMessage(String cellphone, String message) {</span></span>
<span class="line"><span>    this.messageSender.send(cellphone, message);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface MessageSender {</span></span>
<span class="line"><span>  void send(String cellphone, String message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 短信发送类</span></span>
<span class="line"><span>public class SmsSender implements MessageSender {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void send(String cellphone, String message) {</span></span>
<span class="line"><span>    //....</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 站内信发送类</span></span>
<span class="line"><span>public class InboxSender implements MessageSender {</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void send(String cellphone, String message) {</span></span>
<span class="line"><span>    //....</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//使用Notification</span></span>
<span class="line"><span>MessageSender messageSender = new SmsSender();</span></span>
<span class="line"><span>Notification notification = new Notification(messageSender);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，你只需要掌握刚刚举的这个例子，就等于完全掌握了依赖注入。尽管依赖注入非常简单，但却非常有用，在后面的章节中，我们会讲到，它是编写可测试性代码最有效的手段。</p><h2 id="依赖注入框架-di-framework" tabindex="-1"><a class="header-anchor" href="#依赖注入框架-di-framework"><span>依赖注入框架（DI Framework）</span></a></h2><p>弄懂了什么是“依赖注入”，我们再来看一下，什么是“依赖注入框架”。我们还是借用刚刚的例子来解释。</p><p>在采用依赖注入实现的Notification类中，虽然我们不需要用类似hard code的方式，在类内部通过new来创建MessageSender对象，但是，这个创建对象、组装（或注入）对象的工作仅仅是被移动到了更上层代码而已，还是需要我们程序员自己来实现。具体代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  public static final void main(String args[]) {</span></span>
<span class="line"><span>    MessageSender sender = new SmsSender(); //创建对象</span></span>
<span class="line"><span>    Notification notification = new Notification(sender);//依赖注入</span></span>
<span class="line"><span>    notification.sendMessage(&amp;quot;13918942177&amp;quot;, &amp;quot;短信验证码：2346&amp;quot;);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在实际的软件开发中，一些项目可能会涉及几十、上百、甚至几百个类，类对象的创建和依赖注入会变得非常复杂。如果这部分工作都是靠程序员自己写代码来完成，容易出错且开发成本也比较高。而对象创建和依赖注入的工作，本身跟具体的业务无关，我们完全可以抽象成框架来自动完成。</p><p>你可能已经猜到，这个框架就是“依赖注入框架”。我们只需要通过依赖注入框架提供的扩展点，简单配置一下所有需要创建的类对象、类与类之间的依赖关系，就可以实现由框架来自动创建对象、管理对象的生命周期、依赖注入等原本需要程序员来做的事情。</p><p>实际上，现成的依赖注入框架有很多，比如Google Guice、Java Spring、Pico Container、Butterfly Container等。不过，如果你熟悉Java Spring框架，你可能会说，Spring框架自己声称是<strong>控制反转容器</strong>（Inversion Of Control Container）。</p><p>实际上，这两种说法都没错。只是控制反转容器这种表述是一种非常宽泛的描述，DI依赖注入框架的表述更具体、更有针对性。因为我们前面讲到实现控制反转的方式有很多，除了依赖注入，还有模板模式等，而Spring框架的控制反转主要是通过依赖注入来实现的。不过这点区分并不是很明显，也不是很重要，你稍微了解一下就可以了。</p><h2 id="依赖反转原则-dip" tabindex="-1"><a class="header-anchor" href="#依赖反转原则-dip"><span>依赖反转原则（DIP）</span></a></h2><p>前面讲了控制反转、依赖注入、依赖注入框架，现在，我们来讲一讲今天的主角：依赖反转原则。依赖反转原则的英文翻译是Dependency Inversion Principle，缩写为DIP。中文翻译有时候也叫依赖倒置原则。</p><p>为了追本溯源，我先给出这条原则最原汁原味的英文描述：</p><blockquote></blockquote><p>High-level modules shouldn’t depend on low-level modules. Both modules should depend on abstractions. In addition, abstractions shouldn’t depend on details. Details depend on abstractions.</p><p>我们将它翻译成中文，大概意思就是：高层模块（high-level modules）不要依赖低层模块（low-level）。高层模块和低层模块应该通过抽象（abstractions）来互相依赖。除此之外，抽象（abstractions）不要依赖具体实现细节（details），具体实现细节（details）依赖抽象（abstractions）。</p><p>所谓高层模块和低层模块的划分，简单来说就是，在调用链上，调用者属于高层，被调用者属于低层。在平时的业务代码开发中，高层模块依赖底层模块是没有任何问题的。实际上，这条原则主要还是用来指导框架层面的设计，跟前面讲到的控制反转类似。我们拿Tomcat这个Servlet容器作为例子来解释一下。</p><p>Tomcat是运行Java Web应用程序的容器。我们编写的Web应用程序代码只需要部署在Tomcat容器下，便可以被Tomcat容器调用执行。按照之前的划分原则，Tomcat就是高层模块，我们编写的Web应用程序代码就是低层模块。Tomcat和应用程序代码之间并没有直接的依赖关系，两者都依赖同一个“抽象”，也就是Servlet规范。Servlet规范不依赖具体的Tomcat容器和应用程序的实现细节，而Tomcat容器和应用程序依赖Servlet规范。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要掌握的重点内容。</p><p><strong>1.控制反转</strong></p><p>实际上，控制反转是一个比较笼统的设计思想，并不是一种具体的实现方法，一般用来指导框架层面的设计。这里所说的“控制”指的是对程序执行流程的控制，而“反转”指的是在没有使用框架之前，程序员自己控制整个程序的执行。在使用框架之后，整个程序的执行流程通过框架来控制。流程的控制权从程序员“反转”给了框架。</p><p><strong>2.依赖注入</strong></p><p>依赖注入和控制反转恰恰相反，它是一种具体的编码技巧。我们不通过new的方式在类内部创建依赖类的对象，而是将依赖的类对象在外部创建好之后，通过构造函数、函数参数等方式传递（或注入）给类来使用。</p><p><strong>3.依赖注入框架</strong></p><p>我们通过依赖注入框架提供的扩展点，简单配置一下所有需要的类及其类与类之间依赖关系，就可以实现由框架来自动创建对象、管理对象的生命周期、依赖注入等原本需要程序员来做的事情。</p><p><strong>4.依赖反转原则</strong></p><p>依赖反转原则也叫作依赖倒置原则。这条原则跟控制反转有点类似，主要用来指导框架层面的设计。高层模块不依赖低层模块，它们共同依赖同一个抽象。抽象不要依赖具体实现细节，具体实现细节依赖抽象。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><p>从Notification这个例子来看，“基于接口而非实现编程”跟“依赖注入”，看起来非常类似，那它俩有什么区别和联系呢？</p><p>欢迎在留言区写下你的答案，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,52)]))}const t=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99%E4%B8%8E%E6%80%9D%E6%83%B3%EF%BC%9A%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99/19%20_%20%E7%90%86%E8%AE%BA%E4%BA%94%EF%BC%9A%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC%E3%80%81%E4%BE%9D%E8%B5%96%E5%8F%8D%E8%BD%AC%E3%80%81%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5%EF%BC%8C%E8%BF%99%E4%B8%89%E8%80%85%E6%9C%89%E4%BD%95%E5%8C%BA%E5%88%AB%E5%92%8C%E8%81%94%E7%B3%BB%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"关于SOLID原则，我们已经学过单一职责、开闭、里式替换、接口隔离这四个原则。今天，我们再来学习最后一个原则：依赖反转原则。在前面几节课中，我们讲到，单一职责原则和开闭原则的原理比较简单，但是，想要在实践中用好却比较难。而今天我们要讲到的依赖反转原则正好相反。这个原则用起来比较简单，但概念理解起来比较难。比如，下面这几个问题，你看看能否清晰地回答出来：...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99%E4%B8%8E%E6%80%9D%E6%83%B3%EF%BC%9A%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99/19%20_%20%E7%90%86%E8%AE%BA%E4%BA%94%EF%BC%9A%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC%E3%80%81%E4%BE%9D%E8%B5%96%E5%8F%8D%E8%BD%AC%E3%80%81%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5%EF%BC%8C%E8%BF%99%E4%B8%89%E8%80%85%E6%9C%89%E4%BD%95%E5%8C%BA%E5%88%AB%E5%92%8C%E8%81%94%E7%B3%BB%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"关于SOLID原则，我们已经学过单一职责、开闭、里式替换、接口隔离这四个原则。今天，我们再来学习最后一个原则：依赖反转原则。在前面几节课中，我们讲到，单一职责原则和开闭原则的原理比较简单，但是，想要在实践中用好却比较难。而今天我们要讲到的依赖反转原则正好相反。这个原则用起来比较简单，但概念理解起来比较难。比如，下面这几个问题，你看看能否清晰地回答出来：..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":11.37,"words":3412},"filePathRelative":"posts/设计模式之美/设计原则与思想：设计原则/19 _ 理论五：控制反转、依赖反转、依赖注入，这三者有何区别和联系？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"19 | 理论五：控制反转、依赖反转、依赖注入，这三者有何区别和联系？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/f5/6d/f5869e083ecb4c59597ce8eb8964fa6d.mp3\\"></audio></p>\\n<p>关于SOLID原则，我们已经学过单一职责、开闭、里式替换、接口隔离这四个原则。今天，我们再来学习最后一个原则：依赖反转原则。在前面几节课中，我们讲到，单一职责原则和开闭原则的原理比较简单，但是，想要在实践中用好却比较难。而今天我们要讲到的依赖反转原则正好相反。这个原则用起来比较简单，但概念理解起来比较难。比如，下面这几个问题，你看看能否清晰地回答出来：</p>","autoDesc":true}');export{t as comp,v as data};
