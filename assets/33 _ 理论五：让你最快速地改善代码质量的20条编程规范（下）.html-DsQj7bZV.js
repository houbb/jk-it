import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(r,s){return e(),a("div",null,s[0]||(s[0]=[i(`<p><audio id="audio" title="33 | 理论五：让你最快速地改善代码质量的20条编程规范（下）" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/3d/f5/3d70a002608ebd837fe6dc3c6f899ff5.mp3"></audio></p><p>上两节课，我们讲了命名和注释、代码风格，今天我们来讲一些比较实用的编程技巧，帮你切实地提高代码可读性。这部分技巧比较琐碎，也很难罗列全面，我仅仅总结了一些我认为比较关键的，更多的技巧需要你在实践中自己慢慢总结、积累。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="_1-把代码分割成更小的单元块" tabindex="-1"><a class="header-anchor" href="#_1-把代码分割成更小的单元块"><span>1.把代码分割成更小的单元块</span></a></h2><p>大部分人阅读代码的习惯都是，先看整体再看细节。所以，我们要有模块化和抽象思维，善于将大块的复杂逻辑提炼成类或者函数，屏蔽掉细节，让阅读代码的人不至于迷失在细节中，这样能极大地提高代码的可读性。不过，只有代码逻辑比较复杂的时候，我们其实才建议提炼类或者函数。毕竟如果提炼出的函数只包含两三行代码，在阅读代码的时候，还得跳过去看一下，这样反倒增加了阅读成本。</p><p>这里我举一个例子来进一步解释一下。代码具体如下所示。重构前，在invest()函数中，最开始的那段关于时间处理的代码，是不是很难看懂？重构之后，我们将这部分逻辑抽象成一个函数，并且命名为isLastDayOfMonth，从名字就能清晰地了解它的功能，判断今天是不是当月的最后一天。这里，我们就是通过将复杂的逻辑代码提炼成函数，大大提高了代码的可读性。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 重构前的代码</span></span>
<span class="line"><span>public void invest(long userId, long financialProductId) {</span></span>
<span class="line"><span>  Calendar calendar = Calendar.getInstance();</span></span>
<span class="line"><span>  calendar.setTime(date);</span></span>
<span class="line"><span>  calendar.set(Calendar.DATE, (calendar.get(Calendar.DATE) + 1));</span></span>
<span class="line"><span>  if (calendar.get(Calendar.DAY_OF_MONTH) == 1) {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 重构后的代码：提炼函数之后逻辑更加清晰</span></span>
<span class="line"><span>public void invest(long userId, long financialProductId) {</span></span>
<span class="line"><span>  if (isLastDayOfMonth(new Date())) {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  //...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public boolean isLastDayOfMonth(Date date) {</span></span>
<span class="line"><span>  Calendar calendar = Calendar.getInstance();</span></span>
<span class="line"><span>  calendar.setTime(date);</span></span>
<span class="line"><span>  calendar.set(Calendar.DATE, (calendar.get(Calendar.DATE) + 1));</span></span>
<span class="line"><span>  if (calendar.get(Calendar.DAY_OF_MONTH) == 1) {</span></span>
<span class="line"><span>   return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return false;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-避免函数参数过多" tabindex="-1"><a class="header-anchor" href="#_2-避免函数参数过多"><span>2.避免函数参数过多</span></a></h2><p>我个人觉得，函数包含3、4个参数的时候还是能接受的，大于等于5个的时候，我们就觉得参数有点过多了，会影响到代码的可读性，使用起来也不方便。针对参数过多的情况，一般有2种处理方法。</p><ul><li>考虑函数是否职责单一，是否能通过拆分成多个函数的方式来减少参数。示例代码如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public User getUser(String username, String telephone, String email);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 拆分成多个函数</span></span>
<span class="line"><span>public User getUserByUsername(String username);</span></span>
<span class="line"><span>public User getUserByTelephone(String telephone);</span></span>
<span class="line"><span>public User getUserByEmail(String email);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>将函数的参数封装成对象。示例代码如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void postBlog(String title, String summary, String keywords, String content, String category, long authorId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将参数封装成对象</span></span>
<span class="line"><span>public class Blog {</span></span>
<span class="line"><span>  private String title;</span></span>
<span class="line"><span>  private String summary;</span></span>
<span class="line"><span>  private String keywords;</span></span>
<span class="line"><span>  private Strint content;</span></span>
<span class="line"><span>  private String category;</span></span>
<span class="line"><span>  private long authorId;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public void postBlog(Blog blog);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除此之外，如果函数是对外暴露的远程接口，将参数封装成对象，还可以提高接口的兼容性。在往接口中添加新的参数的时候，老的远程接口调用者有可能就不需要修改代码来兼容新的接口了。</p><h2 id="_3-勿用函数参数来控制逻辑" tabindex="-1"><a class="header-anchor" href="#_3-勿用函数参数来控制逻辑"><span>3.勿用函数参数来控制逻辑</span></a></h2><p>不要在函数中使用布尔类型的标识参数来控制内部逻辑，true的时候走这块逻辑，false的时候走另一块逻辑。这明显违背了单一职责原则和接口隔离原则。我建议将其拆成两个函数，可读性上也要更好。我举个例子来说明一下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void buyCourse(long userId, long courseId, boolean isVip);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将其拆分成两个函数</span></span>
<span class="line"><span>public void buyCourse(long userId, long courseId);</span></span>
<span class="line"><span>public void buyCourseForVip(long userId, long courseId);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过，如果函数是private私有函数，影响范围有限，或者拆分之后的两个函数经常同时被调用，我们可以酌情考虑保留标识参数。示例代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 拆分成两个函数的调用方式</span></span>
<span class="line"><span>boolean isVip = false;</span></span>
<span class="line"><span>//...省略其他逻辑...</span></span>
<span class="line"><span>if (isVip) {</span></span>
<span class="line"><span>  buyCourseForVip(userId, courseId);</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  buyCourse(userId, courseId);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 保留标识参数的调用方式更加简洁</span></span>
<span class="line"><span>boolean isVip = false;</span></span>
<span class="line"><span>//...省略其他逻辑...</span></span>
<span class="line"><span>buyCourse(userId, courseId, isVip);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了布尔类型作为标识参数来控制逻辑的情况外，还有一种“根据参数是否为null”来控制逻辑的情况。针对这种情况，我们也应该将其拆分成多个函数。拆分之后的函数职责更明确，不容易用错。具体代码示例如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public List&amp;lt;Transaction&amp;gt; selectTransactions(Long userId, Date startDate, Date endDate) {</span></span>
<span class="line"><span>  if (startDate != null &amp;amp;&amp;amp; endDate != null) {</span></span>
<span class="line"><span>    // 查询两个时间区间的transactions</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (startDate != null &amp;amp;&amp;amp; endDate == null) {</span></span>
<span class="line"><span>    // 查询startDate之后的所有transactions</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (startDate == null &amp;amp;&amp;amp; endDate != null) {</span></span>
<span class="line"><span>    // 查询endDate之前的所有transactions</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (startDate == null &amp;amp;&amp;amp; endDate == null) {</span></span>
<span class="line"><span>    // 查询所有的transactions</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 拆分成多个public函数，更加清晰、易用</span></span>
<span class="line"><span>public List&amp;lt;Transaction&amp;gt; selectTransactionsBetween(Long userId, Date startDate, Date endDate) {</span></span>
<span class="line"><span>  return selectTransactions(userId, startDate, endDate);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public List&amp;lt;Transaction&amp;gt; selectTransactionsStartWith(Long userId, Date startDate) {</span></span>
<span class="line"><span>  return selectTransactions(userId, startDate, null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public List&amp;lt;Transaction&amp;gt; selectTransactionsEndWith(Long userId, Date endDate) {</span></span>
<span class="line"><span>  return selectTransactions(userId, null, endDate);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public List&amp;lt;Transaction&amp;gt; selectAllTransactions(Long userId) {</span></span>
<span class="line"><span>  return selectTransactions(userId, null, null);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private List&amp;lt;Transaction&amp;gt; selectTransactions(Long userId, Date startDate, Date endDate) {</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-函数设计要职责单一" tabindex="-1"><a class="header-anchor" href="#_4-函数设计要职责单一"><span>4.函数设计要职责单一</span></a></h2><p>我们在前面讲到单一职责原则的时候，针对的是类、模块这样的应用对象。实际上，对于函数的设计来说，更要满足单一职责原则。相对于类和模块，函数的粒度比较小，代码行数少，所以在应用单一职责原则的时候，没有像应用到类或者模块那样模棱两可，能多单一就多单一。</p><p>具体的代码示例如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public boolean checkUserIfExisting(String telephone, String username, String email)  { </span></span>
<span class="line"><span>  if (!StringUtils.isBlank(telephone)) {</span></span>
<span class="line"><span>    User user = userRepo.selectUserByTelephone(telephone);</span></span>
<span class="line"><span>    return user != null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (!StringUtils.isBlank(username)) {</span></span>
<span class="line"><span>    User user = userRepo.selectUserByUsername(username);</span></span>
<span class="line"><span>    return user != null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (!StringUtils.isBlank(email)) {</span></span>
<span class="line"><span>    User user = userRepo.selectUserByEmail(email);</span></span>
<span class="line"><span>    return user != null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  return false;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 拆分成三个函数</span></span>
<span class="line"><span>public boolean checkUserIfExistingByTelephone(String telephone);</span></span>
<span class="line"><span>public boolean checkUserIfExistingByUsername(String username);</span></span>
<span class="line"><span>public boolean checkUserIfExistingByEmail(String email);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-移除过深的嵌套层次" tabindex="-1"><a class="header-anchor" href="#_5-移除过深的嵌套层次"><span>5.移除过深的嵌套层次</span></a></h2><p>代码嵌套层次过深往往是因为if-else、switch-case、for循环过度嵌套导致的。我个人建议，嵌套最好不超过两层，超过两层之后就要思考一下是否可以减少嵌套。过深的嵌套本身理解起来就比较费劲，除此之外，嵌套过深很容易因为代码多次缩进，导致嵌套内部的语句超过一行的长度而折成两行，影响代码的整洁。</p><p>解决嵌套过深的方法也比较成熟，有下面4种常见的思路。</p><ul><li>去掉多余的if或else语句。代码示例如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 示例一</span></span>
<span class="line"><span>public double caculateTotalAmount(List&amp;lt;Order&amp;gt; orders) {</span></span>
<span class="line"><span>  if (orders == null || orders.isEmpty()) {</span></span>
<span class="line"><span>    return 0.0;</span></span>
<span class="line"><span>  } else { // 此处的else可以去掉</span></span>
<span class="line"><span>    double amount = 0.0;</span></span>
<span class="line"><span>    for (Order order : orders) {</span></span>
<span class="line"><span>      if (order != null) {</span></span>
<span class="line"><span>        amount += (order.getCount() * order.getPrice());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return amount;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例二</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; matchStrings(List&amp;lt;String&amp;gt; strList,String substr) {</span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; matchedStrings = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  if (strList != null &amp;amp;&amp;amp; substr != null) {</span></span>
<span class="line"><span>    for (String str : strList) {</span></span>
<span class="line"><span>      if (str != null) { // 跟下面的if语句可以合并在一起</span></span>
<span class="line"><span>        if (str.contains(substr)) {</span></span>
<span class="line"><span>          matchedStrings.add(str);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return matchedStrings;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>使用编程语言提供的continue、break、return关键字，提前退出嵌套。代码示例如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 重构前的代码</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; matchStrings(List&amp;lt;String&amp;gt; strList,String substr) {</span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; matchedStrings = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  if (strList != null &amp;amp;&amp;amp; substr != null){ </span></span>
<span class="line"><span>    for (String str : strList) {</span></span>
<span class="line"><span>      if (str != null &amp;amp;&amp;amp; str.contains(substr)) {</span></span>
<span class="line"><span>        matchedStrings.add(str);</span></span>
<span class="line"><span>        // 此处还有10行代码...</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return matchedStrings;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 重构后的代码：使用continue提前退出</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; matchStrings(List&amp;lt;String&amp;gt; strList,String substr) {</span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; matchedStrings = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  if (strList != null &amp;amp;&amp;amp; substr != null){ </span></span>
<span class="line"><span>    for (String str : strList) {</span></span>
<span class="line"><span>      if (str == null || !str.contains(substr)) {</span></span>
<span class="line"><span>        continue; </span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      matchedStrings.add(str);</span></span>
<span class="line"><span>      // 此处还有10行代码...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return matchedStrings;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>调整执行顺序来减少嵌套。具体的代码示例如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 重构前的代码</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; matchStrings(List&amp;lt;String&amp;gt; strList,String substr) {</span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; matchedStrings = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  if (strList != null &amp;amp;&amp;amp; substr != null) {</span></span>
<span class="line"><span>    for (String str : strList) {</span></span>
<span class="line"><span>      if (str != null) {</span></span>
<span class="line"><span>        if (str.contains(substr)) {</span></span>
<span class="line"><span>          matchedStrings.add(str);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return matchedStrings;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 重构后的代码：先执行判空逻辑，再执行正常逻辑</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; matchStrings(List&amp;lt;String&amp;gt; strList,String substr) {</span></span>
<span class="line"><span>  if (strList == null || substr == null) { //先判空</span></span>
<span class="line"><span>    return Collections.emptyList();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; matchedStrings = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  for (String str : strList) {</span></span>
<span class="line"><span>    if (str != null) {</span></span>
<span class="line"><span>      if (str.contains(substr)) {</span></span>
<span class="line"><span>        matchedStrings.add(str);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return matchedStrings;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>将部分嵌套逻辑封装成函数调用，以此来减少嵌套。具体的代码示例如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 重构前的代码</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; appendSalts(List&amp;lt;String&amp;gt; passwords) {</span></span>
<span class="line"><span>  if (passwords == null || passwords.isEmpty()) {</span></span>
<span class="line"><span>    return Collections.emptyList();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; passwordsWithSalt = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  for (String password : passwords) {</span></span>
<span class="line"><span>    if (password == null) {</span></span>
<span class="line"><span>      continue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (password.length() &amp;lt; 8) {</span></span>
<span class="line"><span>      // ...</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return passwordsWithSalt;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 重构后的代码：将部分逻辑抽成函数</span></span>
<span class="line"><span>public List&amp;lt;String&amp;gt; appendSalts(List&amp;lt;String&amp;gt; passwords) {</span></span>
<span class="line"><span>  if (passwords == null || passwords.isEmpty()) {</span></span>
<span class="line"><span>    return Collections.emptyList();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  List&amp;lt;String&amp;gt; passwordsWithSalt = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>  for (String password : passwords) {</span></span>
<span class="line"><span>    if (password == null) {</span></span>
<span class="line"><span>      continue;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    passwordsWithSalt.add(appendSalt(password));</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return passwordsWithSalt;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private String appendSalt(String password) {</span></span>
<span class="line"><span>  String passwordWithSalt = password;</span></span>
<span class="line"><span>  if (password.length() &amp;lt; 8) {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return passwordWithSalt;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除此之外，常用的还有通过使用多态来替代if-else、switch-case条件判断的方法。这个思路涉及代码结构的改动，我们会在后面的章节中讲到，这里就暂时不展开说明了。</p><h2 id="_6-学会使用解释性变量" tabindex="-1"><a class="header-anchor" href="#_6-学会使用解释性变量"><span>6.学会使用解释性变量</span></a></h2><p>常用的用解释性变量来提高代码的可读性的情况有下面2种。</p><ul><li>常量取代魔法数字。示例代码如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public double CalculateCircularArea(double radius) {</span></span>
<span class="line"><span>  return (3.1415) * radius * radius;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 常量替代魔法数字</span></span>
<span class="line"><span>public static final Double PI = 3.1415;</span></span>
<span class="line"><span>public double CalculateCircularArea(double radius) {</span></span>
<span class="line"><span>  return PI * radius * radius;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>使用解释性变量来解释复杂表达式。示例代码如下所示：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>if (date.after(SUMMER_START) &amp;amp;&amp;amp; date.before(SUMMER_END)) {</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 引入解释性变量后逻辑更加清晰</span></span>
<span class="line"><span>boolean isSummer = date.after(SUMMER_START)&amp;amp;&amp;amp;date.before(SUMMER_END);</span></span>
<span class="line"><span>if (isSummer) {</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。除了今天讲的编程技巧，前两节课我们还分别讲解了命名与注释、代码风格。现在，我们一块来回顾复习一下这三节课的重点内容。</p><p><strong>1.关于命名</strong></p><ul><li>命名的关键是能准确达意。对于不同作用域的命名，我们可以适当地选择不同的长度。</li><li>我们可以借助类的信息来简化属性、函数的命名，利用函数的信息来简化函数参数的命名。</li><li>命名要可读、可搜索。不要使用生僻的、不好读的英文单词来命名。命名要符合项目的统一规范，也不要用些反直觉的命名。</li><li>接口有两种命名方式：一种是在接口中带前缀“I”；另一种是在接口的实现类中带后缀“Impl”。对于抽象类的命名，也有两种方式，一种是带上前缀“Abstract”，一种是不带前缀。这两种命名方式都可以，关键是要在项目中统一。</li></ul><p><strong>2.关于注释</strong></p><ul><li>注释的内容主要包含这样三个方面：做什么、为什么、怎么做。对于一些复杂的类和接口，我们可能还需要写明“如何用”。</li><li>类和函数一定要写注释，而且要写得尽可能全面详细。函数内部的注释要相对少一些，一般都是靠好的命名、提炼函数、解释性变量、总结性注释来提高代码可读性。</li></ul><p><strong>3.关于代码风格</strong></p><ul><li>函数、类多大才合适？函数的代码行数不要超过一屏幕的大小，比如50行。类的大小限制比较难确定。</li><li>一行代码多长最合适？最好不要超过IDE的显示宽度。当然，也不能太小，否则会导致很多稍微长点的语句被折成两行，也会影响到代码的整洁，不利于阅读。</li><li>善用空行分割单元块。对于比较长的函数，为了让逻辑更加清晰，可以使用空行来分割各个代码块。</li><li>四格缩进还是两格缩进？我个人比较推荐使用两格缩进，这样可以节省空间，尤其是在代码嵌套层次比较深的情况下。不管是用两格缩进还是四格缩进，一定不要用tab键缩进。</li><li>大括号是否要另起一行？将大括号放到跟上一条语句同一行，可以节省代码行数。但是将大括号另起新的一行的方式，左右括号可以垂直对齐，哪些代码属于哪一个代码块，更加一目了然。</li><li>类中成员怎么排列？在Google Java编程规范中，依赖类按照字母序从小到大排列。类中先写成员变量后写函数。成员变量之间或函数之间，先写静态成员变量或函数，后写普通变量或函数，并且按照作用域大小依次排列。</li></ul><p><strong>4.关于编码技巧</strong></p><ul><li>将复杂的逻辑提炼拆分成函数和类。</li><li>通过拆分成多个函数或将参数封装为对象的方式，来处理参数过多的情况。</li><li>函数中不要使用参数来做代码执行逻辑的控制。</li><li>函数设计要职责单一。</li><li>移除过深的嵌套层次，方法包括：去掉多余的if或else语句，使用continue、break、return关键字提前退出嵌套，调整执行顺序来减少嵌套，将部分嵌套逻辑抽象成函数。</li><li>用字面常量取代魔法数。</li><li>用解释性变量来解释复杂表达式，以此提高代码可读性。</li></ul><p><strong>5.统一编码规范</strong></p><p>除了这三节讲到的比较细节的知识点之外，最后，还有一条非常重要的，那就是，项目、团队，甚至公司，一定要制定统一的编码规范，并且通过Code Review督促执行，这对提高代码质量有立竿见影的效果。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><p>到此为止，我们整个20条编码规范就讲完了。不知道你掌握了多少呢？除了今天我提到的这些，还有哪些其他的编程技巧，可以明显改善代码的可读性？</p><p>试着在留言区总结罗列一下，和同学一起交流和分享。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,58)]))}const t=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99%E4%B8%8E%E6%80%9D%E6%83%B3%EF%BC%9A%E8%A7%84%E8%8C%83%E4%B8%8E%E9%87%8D%E6%9E%84/33%20_%20%E7%90%86%E8%AE%BA%E4%BA%94%EF%BC%9A%E8%AE%A9%E4%BD%A0%E6%9C%80%E5%BF%AB%E9%80%9F%E5%9C%B0%E6%94%B9%E5%96%84%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F%E7%9A%8420%E6%9D%A1%E7%BC%96%E7%A8%8B%E8%A7%84%E8%8C%83%EF%BC%88%E4%B8%8B%EF%BC%89.html","title":"","lang":"zh-CN","frontmatter":{"description":"上两节课，我们讲了命名和注释、代码风格，今天我们来讲一些比较实用的编程技巧，帮你切实地提高代码可读性。这部分技巧比较琐碎，也很难罗列全面，我仅仅总结了一些我认为比较关键的，更多的技巧需要你在实践中自己慢慢总结、积累。 话不多说，让我们正式开始今天的学习吧！ 1.把代码分割成更小的单元块 大部分人阅读代码的习惯都是，先看整体再看细节。所以，我们要有模块化...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99%E4%B8%8E%E6%80%9D%E6%83%B3%EF%BC%9A%E8%A7%84%E8%8C%83%E4%B8%8E%E9%87%8D%E6%9E%84/33%20_%20%E7%90%86%E8%AE%BA%E4%BA%94%EF%BC%9A%E8%AE%A9%E4%BD%A0%E6%9C%80%E5%BF%AB%E9%80%9F%E5%9C%B0%E6%94%B9%E5%96%84%E4%BB%A3%E7%A0%81%E8%B4%A8%E9%87%8F%E7%9A%8420%E6%9D%A1%E7%BC%96%E7%A8%8B%E8%A7%84%E8%8C%83%EF%BC%88%E4%B8%8B%EF%BC%89.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"上两节课，我们讲了命名和注释、代码风格，今天我们来讲一些比较实用的编程技巧，帮你切实地提高代码可读性。这部分技巧比较琐碎，也很难罗列全面，我仅仅总结了一些我认为比较关键的，更多的技巧需要你在实践中自己慢慢总结、积累。 话不多说，让我们正式开始今天的学习吧！ 1.把代码分割成更小的单元块 大部分人阅读代码的习惯都是，先看整体再看细节。所以，我们要有模块化..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":12.23,"words":3668},"filePathRelative":"posts/设计模式之美/设计原则与思想：规范与重构/33 _ 理论五：让你最快速地改善代码质量的20条编程规范（下）.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"33 | 理论五：让你最快速地改善代码质量的20条编程规范（下）\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/3d/f5/3d70a002608ebd837fe6dc3c6f899ff5.mp3\\"></audio></p>\\n<p>上两节课，我们讲了命名和注释、代码风格，今天我们来讲一些比较实用的编程技巧，帮你切实地提高代码可读性。这部分技巧比较琐碎，也很难罗列全面，我仅仅总结了一些我认为比较关键的，更多的技巧需要你在实践中自己慢慢总结、积累。</p>","autoDesc":true}');export{t as comp,v as data};
