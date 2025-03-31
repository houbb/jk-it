import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="07 | 滥用控制语句：出现控制结构，多半是错误的提示" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/db/98/db5ab88b9e71eaa1328ba11dfa694998.mp3"></audio></p><p>你好，我是郑晔。</p><p>在前面几讲，我们已经讲了不少的坏味道，比如长函数、大类等。对于有一定从业经验的程序员来说，即便不能对这些坏味道有一个很清楚的个人认知，但至少一说出来，通常都知道是怎么回事。</p><p>但这节课我要讲的坏味道对于很多人来说，可能就有点挑战了。这并不是说内容有多难，相反，大部分人对这些内容简直太熟悉了。所以，当我把它们以坏味道的方式呈现出来时，这会极大地挑战很多人的认知。</p><p>这个坏味道就是滥用控制语句，也就是你熟悉的 if、for 等等，这个坏味道非常典型，但很多人每天都用它们，却对问题毫无感知。今天我们就先从一个你容易接受的坏味道开始，说一说使用控制语句时，问题到底出在哪。</p><h2 id="嵌套的代码" tabindex="-1"><a class="header-anchor" href="#嵌套的代码"><span>嵌套的代码</span></a></h2><p>我给你看一张让我印象极其深刻的图，看了之后你就知道我要讲的这个坏味道是什么了。</p><img src="https://static001.geekbang.org/resource/image/20/4f/207d60ffb815dff3272090f876503a4f.jpeg" alt="" title="图片来源于网络"><p>相信不少同学在网上见过这张图，是的，我们接下来就来讨论<strong>嵌套的代码</strong>。</p><p>考虑到篇幅，我就不用这么震撼的代码做案例了，我们还是从规模小一点的代码开始讨论：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void distributeEpubs(final long bookId) {</span></span>
<span class="line"><span>  List&amp;lt;Epub&amp;gt; epubs = this.getEpubsByBookId(bookId);</span></span>
<span class="line"><span>  for (Epub epub : epubs) {</span></span>
<span class="line"><span>    if (epub.isValid()) {</span></span>
<span class="line"><span>      boolean registered = this.registerIsbn(epub);</span></span>
<span class="line"><span>      if (registered) {</span></span>
<span class="line"><span>        this.sendEpub(epub);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }                                            </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一段做 EPUB分发的代码，EPUB 是一种电子书格式。在这里，我们根据作品 ID 找到要分发的 EPUB，然后检查 EPUB 的有效性。对于有效的 EPUB，我们要为它注册 ISBN 信息，注册成功之后，将这个 EPUB 发送出去。</p><p>代码逻辑并不是特别复杂，只不过，在这段代码中，我们看到了多层的缩进，for 循环一层，里面有两个 if ，又多加了两层。即便不是特别复杂的代码，也有这么多的缩进，可想而知，如果逻辑再复杂一点，缩进会成什么样子。</p><p>这段代码之所以会写成这个样子，其实就是我在讲“<a href="https://time.geekbang.org/column/article/327424" target="_blank" rel="noopener noreferrer">长函数</a>”那节课里所说的：“<strong>平铺直叙地写代码</strong>”。这段代码的作者只是按照需求一步一步地把代码实现出来了。从实现功能的角度来说，这段代码肯定没错，但问题在于，在把功能实现之后，他停了下来，而没有把代码重新整理一下。那我们就来替这段代码作者将它整理成应有的样子。</p><p>既然我们不喜欢缩进特别多的代码，那我们就要消除缩进。具体到这段代码，一个着手点是 for 循环，因为通常来说，for 循环处理的是一个集合，而循环里面处理的是这个集合中的一个元素。所以，我们可以把循环中的内容提取成一个函数，让这个函数只处理一个元素，就像下面这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public void distributeEpubs(final long bookId) {</span></span>
<span class="line"><span>  List&amp;lt;Epub&amp;gt; epubs = this.getEpubsByBookId(bookId);</span></span>
<span class="line"><span>  for (Epub epub : epubs) {</span></span>
<span class="line"><span>    this.distributeEpub(epub)；</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void distributeEpub(final Epub epub) {</span></span>
<span class="line"><span>  if (epub.isValid()) {</span></span>
<span class="line"><span>    boolean registered = this.registerIsbn(epub);</span></span>
<span class="line"><span>    if (registered) {</span></span>
<span class="line"><span>      this.sendEpub(epub);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们已经有了一次拆分，分解出来 distributeEpub 函数每次只处理一个元素。拆分出来的两个函数在缩进的问题上，就改善了一点。</p><p>第一个函数 distributeEpubs 只有一层缩进，这是一个正常函数应有的样子，不过，第二个函数 distributeEpub 则还有多层缩进，我们可以继续处理一下。</p><h2 id="if-和-else" tabindex="-1"><a class="header-anchor" href="#if-和-else"><span>if 和 else</span></a></h2><p>在 distributeEpub 里，造成缩进的原因是 if 语句。通常来说，if 语句造成的缩进，很多时候都是在检查某个先决条件，只有条件通过时，才继续执行后续的代码。这样的代码可以使用卫语句（guard clause）来解决，也就是设置单独的检查条件，不满足这个检查条件时，立刻从函数中返回。</p><p>这是一种典型的重构手法：<strong>以卫语句取代嵌套的条件表达式（Replace Nested Conditional with Guard Clauses）</strong>。</p><p>我们来看看改进后的 distributeEpub 函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>private void distributeEpub(final Epub epub) {</span></span>
<span class="line"><span>  if (!epub.isValid()) {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  boolean registered = this.registerIsbn(epub);</span></span>
<span class="line"><span>  if (!registered) {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  this.sendEpub(epub);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>改造后的 distributeEpub 就没有了嵌套，也就没有那么多层的缩进了。你可能已经发现了，经过我们改造之后，代码里只有一层的缩进**。**当代码里只有一层缩进时，代码的复杂度就大大降低了，理解成本和出现问题之后定位的成本也随之大幅度降低。</p><p><strong>函数至多有一层缩进</strong>，这是“对象健身操（《<a href="https://www.infoq.cn/minibook/thoughtworks-anthology" target="_blank" rel="noopener noreferrer">ThoughtWorks文集</a>》书里的一篇）”里的一个规则。前面讲“<a href="https://time.geekbang.org/column/article/327483" target="_blank" rel="noopener noreferrer">大类</a>”的时候，我曾经提到过“对象健身操”这篇文章，其中给出了九条编程规则，下面我们再来讲其中的一条：<strong>不要使用 else 关键字</strong>。</p><p>没错，<strong>else 也是一种坏味道，这是挑战很多程序员认知的</strong>。在大多数人印象中，if 和 else 是亲如一家的整体，它们几乎是比翼齐飞的。那么，else 可以不写吗？可以。我们来看看下面的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public double getEpubPrice(final boolean highQuality, final int chapterSequence) {</span></span>
<span class="line"><span>  double price = 0;</span></span>
<span class="line"><span>  if (highQuality &amp;amp;&amp;amp; chapterSequence &amp;gt; START_CHARGING_SEQUENCE) {</span></span>
<span class="line"><span>    price = 4.99;</span></span>
<span class="line"><span>  } else if (sequenceNumber &amp;gt; START_CHARGING_SEQUENCE</span></span>
<span class="line"><span>        &amp;amp;&amp;amp; sequenceNumber &amp;lt;= FURTHER_CHARGING_SEQUENCE) {</span></span>
<span class="line"><span>    price = 1.99;</span></span>
<span class="line"><span>  } else if (sequenceNumber &amp;gt; FURTHER_CHARGING_SEQUENCE) {</span></span>
<span class="line"><span>    price = 2.99;</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    price = 0.99;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  return price;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个根据 EPUB 信息进行定价的函数，它的定价逻辑正如代码中所示。</p><ul><li>如果是高品质书，而且要是章节序号超过起始付费章节，就定价4.99；</li><li>对一般的书而言，超过起始付费章节，就定价 1.99；超过进一步付费章节，就定价 2.99。</li><li>缺省情况下，定价 0.99。</li></ul><p>就这段代码而言，如果想不使用 else，一个简单的处理手法就是让每个逻辑提前返回，这和我们前面提到的卫语句的解决方案如出一辙：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public double getEpubPrice(final boolean highQuality, final int chapterSequence) {</span></span>
<span class="line"><span>  if (highQuality &amp;amp;&amp;amp; chapterSequence &amp;gt; START_CHARGING_SEQUENCE) {</span></span>
<span class="line"><span>    return 4.99;</span></span>
<span class="line"><span>  } </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (sequenceNumber &amp;gt; START_CHARGING_SEQUENCE</span></span>
<span class="line"><span>        &amp;amp;&amp;amp; sequenceNumber &amp;lt;= FURTHER_CHARGING_SEQUENCE) {</span></span>
<span class="line"><span>    return 1.99;</span></span>
<span class="line"><span>  } </span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (sequenceNumber &amp;gt; FURTHER_CHARGING_SEQUENCE) {</span></span>
<span class="line"><span>    return 2.99;</span></span>
<span class="line"><span>  } </span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return 0.99;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于这种逻辑上还比较简单的代码，这么改造还是比较容易的，而对于一些更为复杂的代码，也许就要用到多态来改进代码了。不过在实际项目中，大部分代码逻辑都是逐渐变得复杂的，所以，最好在它还比较简单时，就把坏味道消灭掉。这才是最理想的做法。</p><p>无论是嵌套的代码，还是 else 语句，我们之所以要把它们视为坏味道，本质上都在追求简单，因为一段代码的分支过多，其复杂度就会大幅度增加。我们一直在说，人脑能够理解的复杂度是有限的，分支过多的代码一定是会超过这个理解范围。</p><p>在软件开发中，有一个衡量代码复杂度常用的标准，叫做<a href="https://en.wikipedia.org/wiki/Cyclomatic_complexity" target="_blank" rel="noopener noreferrer">圈复杂度</a>（Cyclomatic complexity，简称 CC），圈复杂度越高，代码越复杂，理解和维护的成本就越高。在圈复杂度的判定中，循环和选择语句占有重要的地位。圈复杂度可以使用工具来检查，比如，在 Java 世界中，有很多可以检查圈复杂度的工具，我们之前提到过的 Checkstyle 就可以做<a href="https://checkstyle.sourceforge.io/config_metrics.html#CyclomaticComplexity" target="_blank" rel="noopener noreferrer">圈复杂度的检查</a>，你可以限制最大的圈复杂度，当圈复杂度大于某个值的时候，就会报错。</p><p>只要我们能够消除嵌套，消除 else，代码的圈复杂度就不会很高，理解和维护的成本自然也就会随之降低。</p><h2 id="重复的-switch" tabindex="-1"><a class="header-anchor" href="#重复的-switch"><span>重复的 Switch</span></a></h2><p>通过前面内容的介绍，你会发现，循环和选择语句这些你最熟悉的东西，其实都是坏味道出现的高风险地带，必须小心翼翼地使用它们。接下来，还有一个你从编程之初就熟悉的东西，也是另一个坏味道的高风险地带。我们来看两段代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public double getBookPrice(final User user, final Book book) {</span></span>
<span class="line"><span>  double price = book.getPrice();</span></span>
<span class="line"><span>  switch (user.getLevel()) {</span></span>
<span class="line"><span>    case UserLevel.SILVER:</span></span>
<span class="line"><span>      return price * 0.9;</span></span>
<span class="line"><span>    case UserLevel.GOLD: </span></span>
<span class="line"><span>      return price * 0.8;</span></span>
<span class="line"><span>    case UserLevel.PLATINUM:</span></span>
<span class="line"><span>      return price * 0.75;</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>      return price;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>public double getEpubPrice(final User user, final Epub epub) {</span></span>
<span class="line"><span>  double price = epub.getPrice();</span></span>
<span class="line"><span>  switch (user.getLevel()) {</span></span>
<span class="line"><span>    case UserLevel.SILVER:</span></span>
<span class="line"><span>      return price * 0.95;</span></span>
<span class="line"><span>    case UserLevel.GOLD: </span></span>
<span class="line"><span>      return price * 0.85;</span></span>
<span class="line"><span>    case UserLevel.PLATINUM:</span></span>
<span class="line"><span>      return price * 0.8;</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>      return price;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两段代码，分别计算了用户在网站上购买作品在线阅读所支付的价格，以及购买 EPUB 格式电子书所支付的价格。其中，用户实际支付的价格会根据用户在系统中的用户级别有所差异，级别越高，折扣就越高。</p><p>显然，这两个函数里出现了类似的代码，其中最类似的部分就是 switch，都是根据用户级别进行判断。事实上，这并不是仅有的根据用户级别进行判断的代码，各种需要区分用户级别的场景中都有类似的代码，而这也是一种典型的坏味道：<strong>重复的switch（Repeated Switch）</strong>。</p><p>之所以会出现重复的 switch，通常都是缺少了一个模型。所以，应对这种坏味道，重构的手法是：<strong>以多态取代条件表达式（Relace Conditional with Polymorphism）</strong>。具体到这里的代码，我们可以引入一个 UserLevel 的模型，将 switch 消除掉：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>interface UserLevel {</span></span>
<span class="line"><span>  double getBookPrice(Book book);</span></span>
<span class="line"><span>  double getEpubPrice(Epub epub);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class RegularUserLevel implements UserLevel {</span></span>
<span class="line"><span>  public double getBookPrice(final Book book) {</span></span>
<span class="line"><span>    return book.getPrice();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public double getEpubPrice(final Epub epub) {</span></span>
<span class="line"><span>    return epub.getPrice();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class GoldUserLevel implements UserLevel {</span></span>
<span class="line"><span>  public double getBookPrice(final Book book) {</span></span>
<span class="line"><span>    return book.getPrice() * 0.8;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public double getEpubPrice(final Epub epub) {</span></span>
<span class="line"><span>    return epub.getPrice() * 0.85;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class SilverUserLevel implements UserLevel {</span></span>
<span class="line"><span>  public double getBookPrice(final Book book) {</span></span>
<span class="line"><span>    return book.getPrice() * 0.9;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public double getEpubPrice(final Epub epub) {</span></span>
<span class="line"><span>    return epub.getPrice() * 0.85;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class PlatinumUserLevel implements UserLevel {</span></span>
<span class="line"><span>  public double getBookPrice(final Book book) {</span></span>
<span class="line"><span>    return book.getPrice() * 0.75;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  public double getEpubPrice(final Epub epub) {</span></span>
<span class="line"><span>    return epub.getPrice() * 0.8;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有了这个基础，前面的代码就可以把 switch 去掉了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public double getBookPrice(final User user, final Book book) {</span></span>
<span class="line"><span>  UserLevel level = user.getUserLevel()</span></span>
<span class="line"><span>  return level.getBookPrice(book);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>public double getEpubPrice(final User user, final Epub epub) {</span></span>
<span class="line"><span>  UserLevel level = user.getUserLevel()</span></span>
<span class="line"><span>  return level.getEpubPrice(epub);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我在《软件设计之美》讲<a href="https://time.geekbang.org/column/article/261238" target="_blank" rel="noopener noreferrer">开放封闭原则</a>的时候，用的例子和这段代码是类似的，里面也有调整的过程，你有兴趣的话，不妨去看一下。只不过，在那个例子里面，我们看到的是一连串的“ if..else”。我们都知道，switch 其实就是一堆“ if..else” 的简化写法，二者是等价的，所以，这个重构手法，以多态取代的是条件表达式，而不仅仅是取代 switch。</p><p>其实，关于控制语句还有一个坏味道，那就是循环语句。没错，循环本身就是一个坏味道，但讲解它还需要一些知识的铺垫，所以，我会把它放到后面第13节，讲“落后的代码风格”时再来讲解。这里，你只要知道循环语句也是一个坏味道就够了。</p><h2 id="总结时刻" tabindex="-1"><a class="header-anchor" href="#总结时刻"><span>总结时刻</span></a></h2><p>今天我们讲了程序员们最熟悉的控制语句：选择语句和循环语句。遗憾的是，这些语句今天都成了坏味道的高发地带，以各种形态呈现在我们面前：</p><ul><li>嵌套的代码；</li><li>else 语句；</li><li>重复的 switch；</li><li>循环语句。</li></ul><p>嵌套的代码也好，else 语句也罢，二者真正的问题在于，它们会使代码变得复杂，超出人脑所能理解的范畴。我们可以通过提取单个元素操作，降低循环语句的复杂度，而用卫语句来简化条件表达式的编写，降低选择语句的复杂度。一个衡量代码复杂度的标准是圈复杂度，我们可以通过工具检查一段代码的圈复杂度。</p><p>重复的 switch 本质上是缺少了一个模型，可以使用多态取代条件表达式，引入缺少的模型，消除重复的 switch。</p><p>如果今天的内容你只能记住一件事，那请记住：<strong>循环和选择语句，可能都是坏味道。</strong></p><img src="https://static001.geekbang.org/resource/image/6c/9f/6c9aedb0d5d58a0eaf08c7fe36040a9f.jpg" alt=""><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>今天讨论的坏味道挑战了很多人习以为常的编码方式，我想请你谈谈你和这些语句的故事，是不舍也好，是纠结也罢，欢迎在留言区分享你的看法。</p><p>如果这节课的内容确实颠覆了你的认知，也欢迎你把它分享出去，让更多人知道。</p><p>感谢阅读，我们下一讲再见！</p><p>参考资料：<a href="https://time.geekbang.org/column/article/261238" target="_blank" rel="noopener noreferrer">开放封闭原则：不改代码怎么写新功能？</a></p>`,58)]))}const t=n(p,[["render",l]]),u=JSON.parse('{"path":"/posts/%E4%BB%A3%E7%A0%81%E4%B9%8B%E4%B8%91/13%E7%B1%BB%E5%85%B8%E5%9E%8B%E5%9D%8F%E5%91%B3%E9%81%93/07%20_%20%E6%BB%A5%E7%94%A8%E6%8E%A7%E5%88%B6%E8%AF%AD%E5%8F%A5%EF%BC%9A%E5%87%BA%E7%8E%B0%E6%8E%A7%E5%88%B6%E7%BB%93%E6%9E%84%EF%BC%8C%E5%A4%9A%E5%8D%8A%E6%98%AF%E9%94%99%E8%AF%AF%E7%9A%84%E6%8F%90%E7%A4%BA.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是郑晔。 在前面几讲，我们已经讲了不少的坏味道，比如长函数、大类等。对于有一定从业经验的程序员来说，即便不能对这些坏味道有一个很清楚的个人认知，但至少一说出来，通常都知道是怎么回事。 但这节课我要讲的坏味道对于很多人来说，可能就有点挑战了。这并不是说内容有多难，相反，大部分人对这些内容简直太熟悉了。所以，当我把它们以坏味道的方式呈现出来时，这会...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E4%BB%A3%E7%A0%81%E4%B9%8B%E4%B8%91/13%E7%B1%BB%E5%85%B8%E5%9E%8B%E5%9D%8F%E5%91%B3%E9%81%93/07%20_%20%E6%BB%A5%E7%94%A8%E6%8E%A7%E5%88%B6%E8%AF%AD%E5%8F%A5%EF%BC%9A%E5%87%BA%E7%8E%B0%E6%8E%A7%E5%88%B6%E7%BB%93%E6%9E%84%EF%BC%8C%E5%A4%9A%E5%8D%8A%E6%98%AF%E9%94%99%E8%AF%AF%E7%9A%84%E6%8F%90%E7%A4%BA.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是郑晔。 在前面几讲，我们已经讲了不少的坏味道，比如长函数、大类等。对于有一定从业经验的程序员来说，即便不能对这些坏味道有一个很清楚的个人认知，但至少一说出来，通常都知道是怎么回事。 但这节课我要讲的坏味道对于很多人来说，可能就有点挑战了。这并不是说内容有多难，相反，大部分人对这些内容简直太熟悉了。所以，当我把它们以坏味道的方式呈现出来时，这会..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":10.88,"words":3265},"filePathRelative":"posts/代码之丑/13类典型坏味道/07 _ 滥用控制语句：出现控制结构，多半是错误的提示.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"07 | 滥用控制语句：出现控制结构，多半是错误的提示\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/db/98/db5ab88b9e71eaa1328ba11dfa694998.mp3\\"></audio></p>\\n<p>你好，我是郑晔。</p>\\n<p>在前面几讲，我们已经讲了不少的坏味道，比如长函数、大类等。对于有一定从业经验的程序员来说，即便不能对这些坏味道有一个很清楚的个人认知，但至少一说出来，通常都知道是怎么回事。</p>","autoDesc":true}');export{t as comp,u as data};
