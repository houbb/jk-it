import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-CrA-f6So.js";const p={};function l(d,n){return e(),a("div",null,n[0]||(n[0]=[i(`<h1 id="_18-理论四-接口隔离原则有哪三种应用-原则中的-接口-该如何理解" tabindex="-1"><a class="header-anchor" href="#_18-理论四-接口隔离原则有哪三种应用-原则中的-接口-该如何理解"><span>18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？</span></a></h1><p><audio id="audio" title="18 | 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/e6/05/e60f6e929d047f92e7877bb5aea82805.mp3"></audio></p><p>上几节课中，我们学习了SOLID原则中的单一职责原则、开闭原则和里式替换原则，今天我们学习第四个原则，接口隔离原则。它对应SOLID中的英文字母“I”。对于这个原则，最关键就是理解其中“接口”的含义。那针对“接口”，不同的理解方式，对应在原则上也有不同的解读方式。除此之外，接口隔离原则跟我们之前讲到的单一职责原则还有点儿类似，所以今天我也会具体讲一下它们之间的区别和联系。</p><p>话不多说，现在就让我们正式开始今天的学习吧！</p><h2 id="如何理解-接口隔离原则" tabindex="-1"><a class="header-anchor" href="#如何理解-接口隔离原则"><span>如何理解“接口隔离原则”？</span></a></h2><p>接口隔离原则的英文翻译是“ Interface Segregation Principle”，缩写为ISP。Robert Martin在SOLID原则中是这样定义它的：“Clients should not be forced to depend upon interfaces that they do not use。”直译成中文的话就是：客户端不应该被强迫依赖它不需要的接口。其中的“客户端”，可以理解为接口的调用者或者使用者。</p><p>实际上，“接口”这个名词可以用在很多场合中。生活中我们可以用它来指插座接口等。在软件开发中，我们既可以把它看作一组抽象的约定，也可以具体指系统与系统之间的API接口，还可以特指面向对象编程语言中的接口等。</p><p>前面我提到，理解接口隔离原则的关键，就是理解其中的“接口”二字。在这条原则中，我们可以把“接口”理解为下面三种东西：</p><ul><li>一组API接口集合</li><li>单个API接口或函数</li><li>OOP中的接口概念</li></ul><p>接下来，我就按照这三种理解方式来详细讲一下，在不同的场景下，这条原则具体是如何解读和应用的。</p><h2 id="把-接口-理解为一组api接口集合" tabindex="-1"><a class="header-anchor" href="#把-接口-理解为一组api接口集合"><span>把“接口”理解为一组API接口集合</span></a></h2><p>我们还是结合一个例子来讲解。微服务用户系统提供了一组跟用户相关的API给其他系统使用，比如：注册、登录、获取用户信息等。具体代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public interface UserService {</span></span>
<span class="line"><span>  boolean register(String cellphone, String password);</span></span>
<span class="line"><span>  boolean login(String cellphone, String password);</span></span>
<span class="line"><span>  UserInfo getUserInfoById(long id);</span></span>
<span class="line"><span>  UserInfo getUserInfoByCellphone(String cellphone);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserServiceImpl implements UserService {</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，我们的后台管理系统要实现删除用户的功能，希望用户系统提供一个删除用户的接口。这个时候我们该如何来做呢？你可能会说，这不是很简单吗，我只需要在UserService中新添加一个deleteUserByCellphone()或deleteUserById()接口就可以了。这个方法可以解决问题，但是也隐藏了一些安全隐患。</p><p>删除用户是一个非常慎重的操作，我们只希望通过后台管理系统来执行，所以这个接口只限于给后台管理系统使用。如果我们把它放到UserService中，那所有使用到UserService的系统，都可以调用这个接口。不加限制地被其他业务系统调用，就有可能导致误删用户。</p><p>当然，最好的解决方案是从架构设计的层面，通过接口鉴权的方式来限制接口的调用。不过，如果暂时没有鉴权框架来支持，我们还可以从代码设计的层面，尽量避免接口被误用。我们参照接口隔离原则，调用者不应该强迫依赖它不需要的接口，将删除接口单独放到另外一个接口RestrictedUserService中，然后将RestrictedUserService只打包提供给后台管理系统来使用。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public interface UserService {</span></span>
<span class="line"><span>  boolean register(String cellphone, String password);</span></span>
<span class="line"><span>  boolean login(String cellphone, String password);</span></span>
<span class="line"><span>  UserInfo getUserInfoById(long id);</span></span>
<span class="line"><span>  UserInfo getUserInfoByCellphone(String cellphone);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface RestrictedUserService {</span></span>
<span class="line"><span>  boolean deleteUserByCellphone(String cellphone);</span></span>
<span class="line"><span>  boolean deleteUserById(long id);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserServiceImpl implements UserService, RestrictedUserService {</span></span>
<span class="line"><span>  // ...省略实现代码...</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在刚刚的这个例子中，我们把接口隔离原则中的接口，理解为一组接口集合，它可以是某个微服务的接口，也可以是某个类库的接口等等。在设计微服务或者类库接口的时候，如果部分接口只被部分调用者使用，那我们就需要将这部分接口隔离出来，单独给对应的调用者使用，而不是强迫其他调用者也依赖这部分不会被用到的接口。</p><h2 id="把-接口-理解为单个api接口或函数" tabindex="-1"><a class="header-anchor" href="#把-接口-理解为单个api接口或函数"><span>把“接口”理解为单个API接口或函数</span></a></h2><p>现在我们再换一种理解方式，把接口理解为单个接口或函数（以下为了方便讲解，我都简称为“函数”）。那接口隔离原则就可以理解为：函数的设计要功能单一，不要将多个不同的功能逻辑在一个函数中实现。接下来，我们还是通过一个例子来解释一下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Statistics {</span></span>
<span class="line"><span>  private Long max;</span></span>
<span class="line"><span>  private Long min;</span></span>
<span class="line"><span>  private Long average;</span></span>
<span class="line"><span>  private Long sum;</span></span>
<span class="line"><span>  private Long percentile99;</span></span>
<span class="line"><span>  private Long percentile999;</span></span>
<span class="line"><span>  //...省略constructor/getter/setter等方法...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public Statistics count(Collection&amp;lt;Long&amp;gt; dataSet) {</span></span>
<span class="line"><span>  Statistics statistics = new Statistics();</span></span>
<span class="line"><span>  //...省略计算逻辑...</span></span>
<span class="line"><span>  return statistics;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码中，count()函数的功能不够单一，包含很多不同的统计功能，比如，求最大值、最小值、平均值等等。按照接口隔离原则，我们应该把count()函数拆成几个更小粒度的函数，每个函数负责一个独立的统计功能。拆分之后的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public Long max(Collection&amp;lt;Long&amp;gt; dataSet) { //... }</span></span>
<span class="line"><span>public Long min(Collection&amp;lt;Long&amp;gt; dataSet) { //... } </span></span>
<span class="line"><span>public Long average(Colletion&amp;lt;Long&amp;gt; dataSet) { //... }</span></span>
<span class="line"><span>// ...省略其他统计函数...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过，你可能会说，在某种意义上讲，count()函数也不能算是职责不够单一，毕竟它做的事情只跟统计相关。我们在讲单一职责原则的时候，也提到过类似的问题。实际上，判定功能是否单一，除了很强的主观性，还需要结合具体的场景。</p><p>如果在项目中，对每个统计需求，Statistics定义的那几个统计信息都有涉及，那count()函数的设计就是合理的。相反，如果每个统计需求只涉及Statistics罗列的统计信息中一部分，比如，有的只需要用到max、min、average这三类统计信息，有的只需要用到average、sum。而count()函数每次都会把所有的统计信息计算一遍，就会做很多无用功，势必影响代码的性能，特别是在需要统计的数据量很大的时候。所以，在这个应用场景下，count()函数的设计就有点不合理了，我们应该按照第二种设计思路，将其拆分成粒度更细的多个统计函数。</p><p>不过，你应该已经发现，接口隔离原则跟单一职责原则有点类似，不过稍微还是有点区别。单一职责原则针对的是模块、类、接口的设计。而接口隔离原则相对于单一职责原则，一方面它更侧重于接口的设计，另一方面它的思考的角度不同。它提供了一种判断接口是否职责单一的标准：通过调用者如何使用接口来间接地判定。如果调用者只使用部分接口或接口的部分功能，那接口的设计就不够职责单一。</p><h2 id="把-接口-理解为oop中的接口概念" tabindex="-1"><a class="header-anchor" href="#把-接口-理解为oop中的接口概念"><span>把“接口”理解为OOP中的接口概念</span></a></h2><p>除了刚讲过的两种理解方式，我们还可以把“接口”理解为OOP中的接口概念，比如Java中的interface。我还是通过一个例子来给你解释。</p><p>假设我们的项目中用到了三个外部系统：Redis、MySQL、Kafka。每个系统都对应一系列配置信息，比如地址、端口、访问超时时间等。为了在内存中存储这些配置信息，供项目中的其他模块来使用，我们分别设计实现了三个Configuration类：RedisConfig、MysqlConfig、KafkaConfig。具体的代码实现如下所示。注意，这里我只给出了RedisConfig的代码实现，另外两个都是类似的，我这里就不贴了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class RedisConfig {</span></span>
<span class="line"><span>    private ConfigSource configSource; //配置中心（比如zookeeper）</span></span>
<span class="line"><span>    private String address;</span></span>
<span class="line"><span>    private int timeout;</span></span>
<span class="line"><span>    private int maxTotal;</span></span>
<span class="line"><span>    //省略其他配置: maxWaitMillis,maxIdle,minIdle...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public RedisConfig(ConfigSource configSource) {</span></span>
<span class="line"><span>        this.configSource = configSource;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getAddress() {</span></span>
<span class="line"><span>        return this.address;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //...省略其他get()、init()方法...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void update() {</span></span>
<span class="line"><span>      //从configSource加载配置到address/timeout/maxTotal...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class KafkaConfig { //...省略... }</span></span>
<span class="line"><span>public class MysqlConfig { //...省略... }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，我们有一个新的功能需求，希望支持Redis和Kafka配置信息的热更新。所谓“热更新（hot update）”就是，如果在配置中心中更改了配置信息，我们希望在不用重启系统的情况下，能将最新的配置信息加载到内存中（也就是RedisConfig、KafkaConfig类中）。但是，因为某些原因，我们并不希望对MySQL的配置信息进行热更新。</p><p>为了实现这样一个功能需求，我们设计实现了一个ScheduledUpdater类，以固定时间频率（periodInSeconds）来调用RedisConfig、KafkaConfig的update()方法更新配置信息。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public interface Updater {</span></span>
<span class="line"><span>  void update();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RedisConfig implemets Updater {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void update() { //... }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class KafkaConfig implements Updater {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void update() { //... }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MysqlConfig { //...省略其他属性和方法... }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ScheduledUpdater {</span></span>
<span class="line"><span>    private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();;</span></span>
<span class="line"><span>    private long initialDelayInSeconds;</span></span>
<span class="line"><span>    private long periodInSeconds;</span></span>
<span class="line"><span>    private Updater updater;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public ScheduleUpdater(Updater updater, long initialDelayInSeconds, long periodInSeconds) {</span></span>
<span class="line"><span>        this.updater = updater;</span></span>
<span class="line"><span>        this.initialDelayInSeconds = initialDelayInSeconds;</span></span>
<span class="line"><span>        this.periodInSeconds = periodInSeconds;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        executor.scheduleAtFixedRate(new Runnable() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void run() {</span></span>
<span class="line"><span>                updater.update();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }, this.initialDelayInSeconds, this.periodInSeconds, TimeUnit.SECONDS);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>  ConfigSource configSource = new ZookeeperConfigSource(/*省略参数*/);</span></span>
<span class="line"><span>  public static final RedisConfig redisConfig = new RedisConfig(configSource);</span></span>
<span class="line"><span>  public static final KafkaConfig kafkaConfig = new KakfaConfig(configSource);</span></span>
<span class="line"><span>  public static final MySqlConfig mysqlConfig = new MysqlConfig(configSource);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    ScheduledUpdater redisConfigUpdater = new ScheduledUpdater(redisConfig, 300, 300);</span></span>
<span class="line"><span>    redisConfigUpdater.run();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ScheduledUpdater kafkaConfigUpdater = new ScheduledUpdater(kafkaConfig, 60, 60);</span></span>
<span class="line"><span>    kafkaConfigUpdater.run();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>刚刚的热更新的需求我们已经搞定了。现在，我们又有了一个新的监控功能需求。通过命令行来查看Zookeeper中的配置信息是比较麻烦的。所以，我们希望能有一种更加方便的配置信息查看方式。</p><p>我们可以在项目中开发一个内嵌的SimpleHttpServer，输出项目的配置信息到一个固定的HTTP地址，比如：<a href="http://127.0.0.1:2389/config" target="_blank" rel="noopener noreferrer">http://127.0.0.1:2389/config</a> 。我们只需要在浏览器中输入这个地址，就可以显示出系统的配置信息。不过，出于某些原因，我们只想暴露MySQL和Redis的配置信息，不想暴露Kafka的配置信息。</p><p>为了实现这样一个功能，我们还需要对上面的代码做进一步改造。改造之后的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public interface Updater {</span></span>
<span class="line"><span>  void update();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface Viewer {</span></span>
<span class="line"><span>  String outputInPlainText();</span></span>
<span class="line"><span>  Map&amp;lt;String, String&amp;gt; output();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RedisConfig implemets Updater, Viewer {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void update() { //... }</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public String outputInPlainText() { //... }</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public Map&amp;lt;String, String&amp;gt; output() { //...}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class KafkaConfig implements Updater {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void update() { //... }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MysqlConfig implements Viewer {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public String outputInPlainText() { //... }</span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public Map&amp;lt;String, String&amp;gt; output() { //...}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SimpleHttpServer {</span></span>
<span class="line"><span>  private String host;</span></span>
<span class="line"><span>  private int port;</span></span>
<span class="line"><span>  private Map&amp;lt;String, List&amp;lt;Viewer&amp;gt;&amp;gt; viewers = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public SimpleHttpServer(String host, int port) {//...}</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void addViewers(String urlDirectory, Viewer viewer) {</span></span>
<span class="line"><span>    if (!viewers.containsKey(urlDirectory)) {</span></span>
<span class="line"><span>      viewers.put(urlDirectory, new ArrayList&amp;lt;Viewer&amp;gt;());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.viewers.get(urlDirectory).add(viewer);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void run() { //... }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>    ConfigSource configSource = new ZookeeperConfigSource();</span></span>
<span class="line"><span>    public static final RedisConfig redisConfig = new RedisConfig(configSource);</span></span>
<span class="line"><span>    public static final KafkaConfig kafkaConfig = new KakfaConfig(configSource);</span></span>
<span class="line"><span>    public static final MySqlConfig mysqlConfig = new MySqlConfig(configSource);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ScheduledUpdater redisConfigUpdater =</span></span>
<span class="line"><span>            new ScheduledUpdater(redisConfig, 300, 300);</span></span>
<span class="line"><span>        redisConfigUpdater.run();</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        ScheduledUpdater kafkaConfigUpdater =</span></span>
<span class="line"><span>            new ScheduledUpdater(kafkaConfig, 60, 60);</span></span>
<span class="line"><span>        redisConfigUpdater.run();</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        SimpleHttpServer simpleHttpServer = new SimpleHttpServer(“127.0.0.1”, 2389);</span></span>
<span class="line"><span>        simpleHttpServer.addViewer(&amp;quot;/config&amp;quot;, redisConfig);</span></span>
<span class="line"><span>        simpleHttpServer.addViewer(&amp;quot;/config&amp;quot;, mysqlConfig);</span></span>
<span class="line"><span>        simpleHttpServer.run();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，热更新和监控的需求我们就都实现了。我们来回顾一下这个例子的设计思想。</p><p>我们设计了两个功能非常单一的接口：Updater和Viewer。ScheduledUpdater只依赖Updater这个跟热更新相关的接口，不需要被强迫去依赖不需要的Viewer接口，满足接口隔离原则。同理，SimpleHttpServer只依赖跟查看信息相关的Viewer接口，不依赖不需要的Updater接口，也满足接口隔离原则。</p><p>你可能会说，如果我们不遵守接口隔离原则，不设计Updater和Viewer两个小接口，而是设计一个大而全的Config接口，让RedisConfig、KafkaConfig、MysqlConfig都实现这个Config接口，并且将原来传递给ScheduledUpdater的Updater和传递给SimpleHttpServer的Viewer，都替换为Config，那会有什么问题呢？我们先来看一下，按照这个思路来实现的代码是什么样的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public interface Config {</span></span>
<span class="line"><span>  void update();</span></span>
<span class="line"><span>  String outputInPlainText();</span></span>
<span class="line"><span>  Map&amp;lt;String, String&amp;gt; output();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class RedisConfig implements Config {</span></span>
<span class="line"><span>  //...需要实现Config的三个接口update/outputIn.../output</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class KafkaConfig implements Config {</span></span>
<span class="line"><span>  //...需要实现Config的三个接口update/outputIn.../output</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class MysqlConfig implements Config {</span></span>
<span class="line"><span>  //...需要实现Config的三个接口update/outputIn.../output</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ScheduledUpdater {</span></span>
<span class="line"><span>  //...省略其他属性和方法..</span></span>
<span class="line"><span>  private Config config;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ScheduleUpdater(Config config, long initialDelayInSeconds, long periodInSeconds) {</span></span>
<span class="line"><span>      this.config = config;</span></span>
<span class="line"><span>      //...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SimpleHttpServer {</span></span>
<span class="line"><span>  private String host;</span></span>
<span class="line"><span>  private int port;</span></span>
<span class="line"><span>  private Map&amp;lt;String, List&amp;lt;Config&amp;gt;&amp;gt; viewers = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>  public SimpleHttpServer(String host, int port) {//...}</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void addViewer(String urlDirectory, Config config) {</span></span>
<span class="line"><span>    if (!viewers.containsKey(urlDirectory)) {</span></span>
<span class="line"><span>      viewers.put(urlDirectory, new ArrayList&amp;lt;Config&amp;gt;());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    viewers.get(urlDirectory).add(config);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public void run() { //... }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样的设计思路也是能工作的，但是对比前后两个设计思路，在同样的代码量、实现复杂度、同等可读性的情况下，第一种设计思路显然要比第二种好很多。为什么这么说呢？主要有两点原因。</p><p>**首先，第一种设计思路更加灵活、易扩展、易复用。**因为Updater、Viewer职责更加单一，单一就意味了通用、复用性好。比如，我们现在又有一个新的需求，开发一个Metrics性能统计模块，并且希望将Metrics也通过SimpleHttpServer显示在网页上，以方便查看。这个时候，尽管Metrics跟RedisConfig等没有任何关系，但我们仍然可以让Metrics类实现非常通用的Viewer接口，复用SimpleHttpServer的代码实现。具体的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class ApiMetrics implements Viewer {//...}</span></span>
<span class="line"><span>public class DbMetrics implements Viewer {//...}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Application {</span></span>
<span class="line"><span>    ConfigSource configSource = new ZookeeperConfigSource();</span></span>
<span class="line"><span>    public static final RedisConfig redisConfig = new RedisConfig(configSource);</span></span>
<span class="line"><span>    public static final KafkaConfig kafkaConfig = new KakfaConfig(configSource);</span></span>
<span class="line"><span>    public static final MySqlConfig mySqlConfig = new MySqlConfig(configSource);</span></span>
<span class="line"><span>    public static final ApiMetrics apiMetrics = new ApiMetrics();</span></span>
<span class="line"><span>    public static final DbMetrics dbMetrics = new DbMetrics();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SimpleHttpServer simpleHttpServer = new SimpleHttpServer(“127.0.0.1”, 2389);</span></span>
<span class="line"><span>        simpleHttpServer.addViewer(&amp;quot;/config&amp;quot;, redisConfig);</span></span>
<span class="line"><span>        simpleHttpServer.addViewer(&amp;quot;/config&amp;quot;, mySqlConfig);</span></span>
<span class="line"><span>        simpleHttpServer.addViewer(&amp;quot;/metrics&amp;quot;, apiMetrics);</span></span>
<span class="line"><span>        simpleHttpServer.addViewer(&amp;quot;/metrics&amp;quot;, dbMetrics);</span></span>
<span class="line"><span>        simpleHttpServer.run();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>**其次，第二种设计思路在代码实现上做了一些无用功。**因为Config接口中包含两类不相关的接口，一类是update()，一类是output()和outputInPlainText()。理论上，KafkaConfig只需要实现update()接口，并不需要实现output()相关的接口。同理，MysqlConfig只需要实现output()相关接口，并需要实现update()接口。但第二种设计思路要求RedisConfig、KafkaConfig、MySqlConfig必须同时实现Config的所有接口函数（update、output、outputInPlainText）。除此之外，如果我们要往Config中继续添加一个新的接口，那所有的实现类都要改动。相反，如果我们的接口粒度比较小，那涉及改动的类就比较少。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>今天的内容到此就讲完了。我们一块来总结回顾一下，你需要掌握的重点内容。</p><p><strong>1.如何理解“接口隔离原则”？</strong></p><p>理解“接口隔离原则”的重点是理解其中的“接口”二字。这里有三种不同的理解。</p><p>如果把“接口”理解为一组接口集合，可以是某个微服务的接口，也可以是某个类库的接口等。如果部分接口只被部分调用者使用，我们就需要将这部分接口隔离出来，单独给这部分调用者使用，而不强迫其他调用者也依赖这部分不会被用到的接口。</p><p>如果把“接口”理解为单个API接口或函数，部分调用者只需要函数中的部分功能，那我们就需要把函数拆分成粒度更细的多个函数，让调用者只依赖它需要的那个细粒度函数。</p><p>如果把“接口”理解为OOP中的接口，也可以理解为面向对象编程语言中的接口语法。那接口的设计要尽量单一，不要让接口的实现类和调用者，依赖不需要的接口函数。</p><p><strong>2.接口隔离原则与单一职责原则的区别</strong></p><p>单一职责原则针对的是模块、类、接口的设计。接口隔离原则相对于单一职责原则，一方面更侧重于接口的设计，另一方面它的思考角度也是不同的。接口隔离原则提供了一种判断接口的职责是否单一的标准：通过调用者如何使用接口来间接地判定。如果调用者只使用部分接口或接口的部分功能，那接口的设计就不够职责单一。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><p>今天课堂讨论的话题是这样的：</p><p>java.util.concurrent并发包提供了AtomicInteger这样一个原子类，其中有一个函数getAndIncrement()是这样定义的：给整数增加一，并且返回未増之前的值。我的问题是，这个函数的设计是否符合单一职责原则和接口隔离原则？为什么？</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * Atomically increments by one the current value.</span></span>
<span class="line"><span> * @return the previous value</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public final int getAndIncrement() {//...}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>欢迎在留言区写下你的答案，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,59)]))}const t=s(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99%E4%B8%8E%E6%80%9D%E6%83%B3%EF%BC%9A%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99/18%20_%20%E7%90%86%E8%AE%BA%E5%9B%9B%EF%BC%9A%E6%8E%A5%E5%8F%A3%E9%9A%94%E7%A6%BB%E5%8E%9F%E5%88%99%E6%9C%89%E5%93%AA%E4%B8%89%E7%A7%8D%E5%BA%94%E7%94%A8%EF%BC%9F%E5%8E%9F%E5%88%99%E4%B8%AD%E7%9A%84%E2%80%9C%E6%8E%A5%E5%8F%A3%E2%80%9D%E8%AF%A5%E5%A6%82%E4%BD%95%E7%90%86%E8%A7%A3%EF%BC%9F.html","title":"18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？","lang":"zh-CN","frontmatter":{"description":"18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？ 上几节课中，我们学习了SOLID原则中的单一职责原则、开闭原则和里式替换原则，今天我们学习第四个原则，接口隔离原则。它对应SOLID中的英文字母“I”。对于这个原则，最关键就是理解其中“接口”的含义。那针对“接口”，不同的理解方式，对应在原则上也有不同的解读方式。除此之外，接口隔...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99%E4%B8%8E%E6%80%9D%E6%83%B3%EF%BC%9A%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99/18%20_%20%E7%90%86%E8%AE%BA%E5%9B%9B%EF%BC%9A%E6%8E%A5%E5%8F%A3%E9%9A%94%E7%A6%BB%E5%8E%9F%E5%88%99%E6%9C%89%E5%93%AA%E4%B8%89%E7%A7%8D%E5%BA%94%E7%94%A8%EF%BC%9F%E5%8E%9F%E5%88%99%E4%B8%AD%E7%9A%84%E2%80%9C%E6%8E%A5%E5%8F%A3%E2%80%9D%E8%AF%A5%E5%A6%82%E4%BD%95%E7%90%86%E8%A7%A3%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？"}],["meta",{"property":"og:description","content":"18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？ 上几节课中，我们学习了SOLID原则中的单一职责原则、开闭原则和里式替换原则，今天我们学习第四个原则，接口隔离原则。它对应SOLID中的英文字母“I”。对于这个原则，最关键就是理解其中“接口”的含义。那针对“接口”，不同的理解方式，对应在原则上也有不同的解读方式。除此之外，接口隔..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":15.03,"words":4508},"filePathRelative":"posts/设计模式之美/设计原则与思想：设计原则/18 _ 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"18 | 理论四：接口隔离原则有哪三种应用？原则中的“接口”该如何理解？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/e6/05/e60f6e929d047f92e7877bb5aea82805.mp3\\"></audio></p>\\n<p>上几节课中，我们学习了SOLID原则中的单一职责原则、开闭原则和里式替换原则，今天我们学习第四个原则，接口隔离原则。它对应SOLID中的英文字母“I”。对于这个原则，最关键就是理解其中“接口”的含义。那针对“接口”，不同的理解方式，对应在原则上也有不同的解读方式。除此之外，接口隔离原则跟我们之前讲到的单一职责原则还有点儿类似，所以今天我也会具体讲一下它们之间的区别和联系。</p>","autoDesc":true}');export{t as comp,v as data};
