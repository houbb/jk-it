import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-CrA-f6So.js";const l={};function p(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h1 id="_48-代理模式-代理在rpc、缓存、监控等场景中的应用" tabindex="-1"><a class="header-anchor" href="#_48-代理模式-代理在rpc、缓存、监控等场景中的应用"><span>48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用</span></a></h1><p><audio id="audio" title="48 | 代理模式：代理在RPC、缓存、监控等场景中的应用" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/fd/0f/fd357a7b4206ab30616d3485492db30f.mp3"></audio></p><p>前面几节，我们学习了设计模式中的创建型模式。创建型模式主要解决对象的创建问题，封装复杂的创建过程，解耦对象的创建代码和使用代码。</p><p>其中，单例模式用来创建全局唯一的对象。工厂模式用来创建不同但是相关类型的对象（继承同一父类或者接口的一组子类），由给定的参数来决定创建哪种类型的对象。建造者模式是用来创建复杂对象，可以通过设置不同的可选参数，“定制化”地创建不同的对象。原型模式针对创建成本比较大的对象，利用对已有对象进行复制的方式进行创建，以达到节省创建时间的目的。</p><p>从今天起，我们开始学习另外一种类型的设计模式：结构型模式。结构型模式主要总结了一些类或对象组合在一起的经典结构，这些经典的结构可以解决特定应用场景的问题。结构型模式包括：代理模式、桥接模式、装饰器模式、适配器模式、门面模式、组合模式、享元模式。今天我们要讲其中的代理模式。它也是在实际开发中经常被用到的一种设计模式。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="代理模式的原理解析" tabindex="-1"><a class="header-anchor" href="#代理模式的原理解析"><span>代理模式的原理解析</span></a></h2><p><strong>代理模式</strong>（Proxy Design Pattern）的原理和代码实现都不难掌握。它在不改变原始类（或叫被代理类）代码的情况下，通过引入代理类来给原始类附加功能。我们通过一个简单的例子来解释一下这段话。</p><p>这个例子来自我们在第25、26、39、40节中讲的性能计数器。当时我们开发了一个MetricsCollector类，用来收集接口请求的原始数据，比如访问时间、处理时长等。在业务系统中，我们采用如下方式来使用这个MetricsCollector类：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class UserController {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span>  private MetricsCollector metricsCollector; // 依赖注入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserVo login(String telephone, String password) {</span></span>
<span class="line"><span>    long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ... 省略login逻辑...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>    RequestInfo requestInfo = new RequestInfo(&amp;quot;login&amp;quot;, responseTime, startTimestamp);</span></span>
<span class="line"><span>    metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //...返回UserVo数据...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserVo register(String telephone, String password) {</span></span>
<span class="line"><span>    long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // ... 省略register逻辑...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>    RequestInfo requestInfo = new RequestInfo(&amp;quot;register&amp;quot;, responseTime, startTimestamp);</span></span>
<span class="line"><span>    metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //...返回UserVo数据...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很明显，上面的写法有两个问题。第一，性能计数器框架代码侵入到业务代码中，跟业务代码高度耦合。如果未来需要替换这个框架，那替换的成本会比较大。第二，收集接口请求的代码跟业务代码无关，本就不应该放到一个类中。业务类最好职责更加单一，只聚焦业务处理。</p><p>为了将框架代码和业务代码解耦，代理模式就派上用场了。代理类UserControllerProxy和原始类UserController实现相同的接口IUserController。UserController类只负责业务功能。代理类UserControllerProxy负责在业务代码执行前后附加其他逻辑代码，并通过委托的方式调用原始类来执行业务代码。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public interface IUserController {</span></span>
<span class="line"><span>  UserVo login(String telephone, String password);</span></span>
<span class="line"><span>  UserVo register(String telephone, String password);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserController implements IUserController {</span></span>
<span class="line"><span>  //...省略其他属性和方法...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public UserVo login(String telephone, String password) {</span></span>
<span class="line"><span>    //...省略login逻辑...</span></span>
<span class="line"><span>    //...返回UserVo数据...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public UserVo register(String telephone, String password) {</span></span>
<span class="line"><span>    //...省略register逻辑...</span></span>
<span class="line"><span>    //...返回UserVo数据...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class UserControllerProxy implements IUserController {</span></span>
<span class="line"><span>  private MetricsCollector metricsCollector;</span></span>
<span class="line"><span>  private UserController userController;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserControllerProxy(UserController userController) {</span></span>
<span class="line"><span>    this.userController = userController;</span></span>
<span class="line"><span>    this.metricsCollector = new MetricsCollector();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public UserVo login(String telephone, String password) {</span></span>
<span class="line"><span>    long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 委托</span></span>
<span class="line"><span>    UserVo userVo = userController.login(telephone, password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>    RequestInfo requestInfo = new RequestInfo(&amp;quot;login&amp;quot;, responseTime, startTimestamp);</span></span>
<span class="line"><span>    metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return userVo;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public UserVo register(String telephone, String password) {</span></span>
<span class="line"><span>    long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    UserVo userVo = userController.register(telephone, password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>    RequestInfo requestInfo = new RequestInfo(&amp;quot;register&amp;quot;, responseTime, startTimestamp);</span></span>
<span class="line"><span>    metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return userVo;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//UserControllerProxy使用举例</span></span>
<span class="line"><span>//因为原始类和代理类实现相同的接口，是基于接口而非实现编程</span></span>
<span class="line"><span>//将UserController类对象替换为UserControllerProxy类对象，不需要改动太多代码</span></span>
<span class="line"><span>IUserController userController = new UserControllerProxy(new UserController());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参照基于接口而非实现编程的设计思想，将原始类对象替换为代理类对象的时候，为了让代码改动尽量少，在刚刚的代理模式的代码实现中，代理类和原始类需要实现相同的接口。但是，如果原始类并没有定义接口，并且原始类代码并不是我们开发维护的（比如它来自一个第三方的类库），我们也没办法直接修改原始类，给它重新定义一个接口。在这种情况下，我们该如何实现代理模式呢？</p><p>对于这种外部类的扩展，我们一般都是采用继承的方式。这里也不例外。我们让代理类继承原始类，然后扩展附加功能。原理很简单，不需要过多解释，你直接看代码就能明白。具体代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class UserControllerProxy extends UserController {</span></span>
<span class="line"><span>  private MetricsCollector metricsCollector;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserControllerProxy() {</span></span>
<span class="line"><span>    this.metricsCollector = new MetricsCollector();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserVo login(String telephone, String password) {</span></span>
<span class="line"><span>    long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    UserVo userVo = super.login(telephone, password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>    RequestInfo requestInfo = new RequestInfo(&amp;quot;login&amp;quot;, responseTime, startTimestamp);</span></span>
<span class="line"><span>    metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return userVo;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public UserVo register(String telephone, String password) {</span></span>
<span class="line"><span>    long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    UserVo userVo = super.register(telephone, password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>    long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>    RequestInfo requestInfo = new RequestInfo(&amp;quot;register&amp;quot;, responseTime, startTimestamp);</span></span>
<span class="line"><span>    metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return userVo;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//UserControllerProxy使用举例</span></span>
<span class="line"><span>UserController userController = new UserControllerProxy();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="动态代理的原理解析" tabindex="-1"><a class="header-anchor" href="#动态代理的原理解析"><span>动态代理的原理解析</span></a></h2><p>不过，刚刚的代码实现还是有点问题。一方面，我们需要在代理类中，将原始类中的所有的方法，都重新实现一遍，并且为每个方法都附加相似的代码逻辑。另一方面，如果要添加的附加功能的类有不止一个，我们需要针对每个类都创建一个代理类。</p><p>如果有50个要添加附加功能的原始类，那我们就要创建50个对应的代理类。这会导致项目中类的个数成倍增加，增加了代码维护成本。并且，每个代理类中的代码都有点像模板式的“重复”代码，也增加了不必要的开发成本。那这个问题怎么解决呢？</p><p>我们可以使用动态代理来解决这个问题。所谓<strong>动态代理</strong>（Dynamic Proxy），就是我们不事先为每个原始类编写代理类，而是在运行的时候，动态地创建原始类对应的代理类，然后在系统中用代理类替换掉原始类。那如何实现动态代理呢？</p><p>如果你熟悉的是Java语言，实现动态代理就是件很简单的事情。因为Java语言本身就已经提供了动态代理的语法（实际上，动态代理底层依赖的就是Java的反射语法）。我们来看一下，如何用Java的动态代理来实现刚刚的功能。具体的代码如下所示。其中，MetricsCollectorProxy作为一个动态代理类，动态地给每个需要收集接口请求信息的类创建代理类。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class MetricsCollectorProxy {</span></span>
<span class="line"><span>  private MetricsCollector metricsCollector;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public MetricsCollectorProxy() {</span></span>
<span class="line"><span>    this.metricsCollector = new MetricsCollector();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Object createProxy(Object proxiedObject) {</span></span>
<span class="line"><span>    Class&amp;lt;?&amp;gt;[] interfaces = proxiedObject.getClass().getInterfaces();</span></span>
<span class="line"><span>    DynamicProxyHandler handler = new DynamicProxyHandler(proxiedObject);</span></span>
<span class="line"><span>    return Proxy.newProxyInstance(proxiedObject.getClass().getClassLoader(), interfaces, handler);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private class DynamicProxyHandler implements InvocationHandler {</span></span>
<span class="line"><span>    private Object proxiedObject;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public DynamicProxyHandler(Object proxiedObject) {</span></span>
<span class="line"><span>      this.proxiedObject = proxiedObject;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {</span></span>
<span class="line"><span>      long startTimestamp = System.currentTimeMillis();</span></span>
<span class="line"><span>      Object result = method.invoke(proxiedObject, args);</span></span>
<span class="line"><span>      long endTimeStamp = System.currentTimeMillis();</span></span>
<span class="line"><span>      long responseTime = endTimeStamp - startTimestamp;</span></span>
<span class="line"><span>      String apiName = proxiedObject.getClass().getName() + &amp;quot;:&amp;quot; + method.getName();</span></span>
<span class="line"><span>      RequestInfo requestInfo = new RequestInfo(apiName, responseTime, startTimestamp);</span></span>
<span class="line"><span>      metricsCollector.recordRequest(requestInfo);</span></span>
<span class="line"><span>      return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//MetricsCollectorProxy使用举例</span></span>
<span class="line"><span>MetricsCollectorProxy proxy = new MetricsCollectorProxy();</span></span>
<span class="line"><span>IUserController userController = (IUserController) proxy.createProxy(new UserController());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，Spring AOP底层的实现原理就是基于动态代理。用户\b配置好需要给哪些类创建代理，并定义好在执行原始类的业务代码前后执行哪些附加功能。Spring为这些类创建动态代理对象，并在JVM中替代原始类对象。原本在代码中执行的原始类的方法，被换作执行代理类的方法，也就实现了给原始类添加附加功能的目的。</p><h2 id="代理模式的应用场景" tabindex="-1"><a class="header-anchor" href="#代理模式的应用场景"><span>代理模式的应用场景</span></a></h2><p>代理模式的应用场景非常多，我这里列举一些比较常见的用法，希望你能举一反三地应用在你的项目开发中。</p><h3 id="_1-业务系统的非功能性需求开发" tabindex="-1"><a class="header-anchor" href="#_1-业务系统的非功能性需求开发"><span>1.业务系统的非功能性需求开发</span></a></h3><p>代理模式最常用的一个应用场景就是，在业务系统中开发一些非功能性需求，比如：监控、统计、鉴权、限流、事务、幂等、日志。我们将这些附加功能与业务功能解耦，放到代理类中统一处理，让程序员只需要关注业务方面的开发。实际上，前面举的搜集接口请求信息的例子，就是这个应用场景的一个典型例子。</p><p>如果你熟悉Java语言和Spring开发框架，这部分工作都是可以在Spring AOP切面中完成的。前面我们也提到，Spring AOP底层的实现原理就是基于动态代理。</p><h3 id="_2-代理模式在rpc、缓存中的应用" tabindex="-1"><a class="header-anchor" href="#_2-代理模式在rpc、缓存中的应用"><span>2.代理模式在RPC、缓存中的应用</span></a></h3><p><strong>实际上，RPC框架也可以看作一种代理模式</strong>，GoF的《设计模式》一书中把它称作远程代理。通过远程代理，将网络通信、数据编解码等细节隐藏起来。客户端在使用RPC服务的时候，就像使用本地函数一样，无需了解跟服务器交互的细节。除此之外，RPC服务的开发者也只需要开发业务逻辑，就像开发本地使用的函数一样，不需要关注跟客户端的交互细节。</p><p>关于远程代理的代码示例，我自己实现了一个简单的RPC框架Demo，放到了GitHub中，你可以点击这里的<a href="https://github.com/wangzheng0822/codedesign/tree/master/com/xzg/cd/rpc" target="_blank" rel="noopener noreferrer">链接</a>查看。</p><p>**我们再来看代理模式在缓存中的应用。**假设我们要开发一个接口请求的缓存功能，对于某些接口请求，如果入参相同，在设定的过期时间内，直接返回缓存结果，而不用重新进行逻辑处理。比如，针对获取用户个人信息的需求，我们可以开发两个接口，一个支持缓存，一个支持实时查询。对于需要实时数据的需求，我们让其调用实时查询接口，对于不需要实时数据的需求，我们让其调用支持缓存的接口。那如何来实现接口请求的缓存功能呢？</p><p>最简单的实现方法就是刚刚我们讲到的，给每个需要支持缓存的查询需求都开发两个不同的接口，一个支持缓存，一个支持实时查询。但是，这样做显然增加了开发成本，而且会让代码看起来非常臃肿（接口个数成倍增加），也不方便缓存接口的集中管理（增加、删除缓存接口）、集中配置（比如配置每个接口缓存过期时间）。</p><p>针对这些问题，代理模式就能派上用场了，确切地说，应该是动态代理。如果是基于Spring框架来开发的话，那就可以在AOP切面中完成接口缓存的功能。在应用启动的时候，我们从配置文件中加载需要支持缓存的接口，以及相应的缓存策略（比如过期时间）等。当请求到来的时候，我们在AOP切面中拦截请求，如果请求中带有支持缓存的字段（比如http://…?..&amp;cached=true），我们便从缓存（内存缓存或者Redis缓存等）中获取数据直接返回。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要掌握的重点内容。</p><p><strong>1.代理模式的原理与实现</strong></p><p>在不改变原始类（或叫被代理类）的情况下，通过引入代理类来给原始类附加功能。一般情况下，我们让代理类和原始类实现同样的接口。但是，如果原始类并没有定义接口，并且原始类代码并不是我们开发维护的。在这种情况下，我们可以通过让代理类继承原始类的方法来实现代理模式。</p><p><strong>2.动态代理的原理与实现</strong></p><p>静态代理需要针对每个类都创建一个代理类，并且每个代理类中的代码都有点像模板式的“重复”代码，增加了维护成本和开发成本。对于静态代理存在的问题，我们可以通过动态代理来解决。我们不事先为每个原始类编写代理类，而是在运行的时候动态地创建原始类对应的代理类，然后在系统中用代理类替换掉原始类。</p><p><strong>3.代理模式的应用场景</strong></p><p>代理模式常用在业务系统中开发一些非功能性需求，比如：监控、统计、鉴权、限流、事务、幂等、日志。我们将这些附加功能与业务功能解耦，放到代理类统一处理，让程序员只需要关注业务方面的开发。除此之外，代理模式还可以用在RPC、缓存等应用场景中。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><ol><li>除了Java语言之外，在你熟悉的其他语言中，如何实现动态代理呢？</li><li>我们今天讲了两种代理模式的实现方法，一种是基于组合，一种基于继承，请对比一下两者的优缺点。</li></ol><p>欢迎留言和我分享你的思考，如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,45)]))}const d=n(l,[["render",p]]),o=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E7%BB%93%E6%9E%84%E5%9E%8B/48%20_%20%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F%EF%BC%9A%E4%BB%A3%E7%90%86%E5%9C%A8RPC%E3%80%81%E7%BC%93%E5%AD%98%E3%80%81%E7%9B%91%E6%8E%A7%E7%AD%89%E5%9C%BA%E6%99%AF%E4%B8%AD%E7%9A%84%E5%BA%94%E7%94%A8.html","title":"48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用","lang":"zh-CN","frontmatter":{"description":"48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用 前面几节，我们学习了设计模式中的创建型模式。创建型模式主要解决对象的创建问题，封装复杂的创建过程，解耦对象的创建代码和使用代码。 其中，单例模式用来创建全局唯一的对象。工厂模式用来创建不同但是相关类型的对象（继承同一父类或者接口的一组子类），由给定的参数来决定创建哪种类型的对象。建造者模式是用...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E7%BB%93%E6%9E%84%E5%9E%8B/48%20_%20%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F%EF%BC%9A%E4%BB%A3%E7%90%86%E5%9C%A8RPC%E3%80%81%E7%BC%93%E5%AD%98%E3%80%81%E7%9B%91%E6%8E%A7%E7%AD%89%E5%9C%BA%E6%99%AF%E4%B8%AD%E7%9A%84%E5%BA%94%E7%94%A8.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用"}],["meta",{"property":"og:description","content":"48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用 前面几节，我们学习了设计模式中的创建型模式。创建型模式主要解决对象的创建问题，封装复杂的创建过程，解耦对象的创建代码和使用代码。 其中，单例模式用来创建全局唯一的对象。工厂模式用来创建不同但是相关类型的对象（继承同一父类或者接口的一组子类），由给定的参数来决定创建哪种类型的对象。建造者模式是用..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":11.95,"words":3586},"filePathRelative":"posts/设计模式之美/设计模式与范式：结构型/48 _ 代理模式：代理在RPC、缓存、监控等场景中的应用.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"48 | 代理模式：代理在RPC、缓存、监控等场景中的应用\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/fd/0f/fd357a7b4206ab30616d3485492db30f.mp3\\"></audio></p>\\n<p>前面几节，我们学习了设计模式中的创建型模式。创建型模式主要解决对象的创建问题，封装复杂的创建过程，解耦对象的创建代码和使用代码。</p>\\n<p>其中，单例模式用来创建全局唯一的对象。工厂模式用来创建不同但是相关类型的对象（继承同一父类或者接口的一组子类），由给定的参数来决定创建哪种类型的对象。建造者模式是用来创建复杂对象，可以通过设置不同的可选参数，“定制化”地创建不同的对象。原型模式针对创建成本比较大的对象，利用对已有对象进行复制的方式进行创建，以达到节省创建时间的目的。</p>","autoDesc":true}');export{d as comp,o as data};
