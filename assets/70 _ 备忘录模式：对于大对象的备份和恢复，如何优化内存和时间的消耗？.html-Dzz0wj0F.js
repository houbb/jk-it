import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as p,o as i}from"./app-CrA-f6So.js";const e={};function l(t,n){return i(),a("div",null,n[0]||(n[0]=[p(`<h1 id="_70-备忘录模式-对于大对象的备份和恢复-如何优化内存和时间的消耗" tabindex="-1"><a class="header-anchor" href="#_70-备忘录模式-对于大对象的备份和恢复-如何优化内存和时间的消耗"><span>70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？</span></a></h1><p><audio id="audio" title="70 | 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/c5/11/c516c58085171935bcf176471c63b711.mp3"></audio></p><p>上两节课，我们学习了访问者模式。在23种设计模式中，访问者模式的原理和实现可以说是最难理解的了，特别是它的代码实现。其中，用Single Dispatch来模拟Double Dispatch的实现思路尤其不好理解。不知道你有没有将它拿下呢？如果还没有弄得很清楚，那就要多看几遍、多自己动脑经琢磨一下。</p><p>今天，我们学习另外一种行为型模式，备忘录模式。这个模式理解、掌握起来不难，代码实现比较灵活，应用场景也比较明确和有限，主要是用来防丢失、撤销、恢复等。所以，相对于上两节课，今天的内容学起来相对会比较轻松些。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="备忘录模式的原理与实现" tabindex="-1"><a class="header-anchor" href="#备忘录模式的原理与实现"><span>备忘录模式的原理与实现</span></a></h2><p>备忘录模式，也叫快照（Snapshot）模式，英文翻译是Memento Design Pattern。在GoF的《设计模式》一书中，备忘录模式是这么定义的：</p><blockquote></blockquote><p>Captures and externalizes an object’s internal state so that it can be restored later, all without violating encapsulation.</p><p>翻译成中文就是：在不违背封装原则的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便之后恢复对象为先前的状态。</p><p>在我看来，这个模式的定义主要表达了两部分内容。一部分是，存储副本以便后期恢复。这一部分很好理解。另一部分是，要在不违背封装原则的前提下，进行对象的备份和恢复。这部分不太好理解。接下来，我就结合一个例子来解释一下，特别带你搞清楚这两个问题：</p><ul><li>为什么存储和恢复副本会违背封装原则？</li><li>备忘录模式是如何做到不违背封装原则的？</li></ul><p>假设有这样一道面试题，希望你编写一个小程序，可以接收命令行的输入。用户输入文本时，程序将其追加存储在内存文本中；用户输入“:list”，程序在命令行中输出内存文本的内容；用户输入“:undo”，程序会撤销上一次输入的文本，也就是从内存文本中将上次输入的文本删除掉。</p><p>我举了个小例子来解释一下这个需求，如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;gt;hello</span></span>
<span class="line"><span>&amp;gt;:list</span></span>
<span class="line"><span>hello</span></span>
<span class="line"><span>&amp;gt;world</span></span>
<span class="line"><span>&amp;gt;:list</span></span>
<span class="line"><span>helloworld</span></span>
<span class="line"><span>&amp;gt;:undo</span></span>
<span class="line"><span>&amp;gt;:list</span></span>
<span class="line"><span>hello</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>怎么来编程实现呢？你可以打开IDE自己先试着编写一下，然后再看我下面的讲解。整体上来讲，这个小程序实现起来并不复杂。我写了一种实现思路，如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class InputText {</span></span>
<span class="line"><span>  private StringBuilder text = new StringBuilder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getText() {</span></span>
<span class="line"><span>    return text.toString();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void append(String input) {</span></span>
<span class="line"><span>    text.append(input);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void setText(String text) {</span></span>
<span class="line"><span>    this.text.replace(0, this.text.length(), text);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SnapshotHolder {</span></span>
<span class="line"><span>  private Stack&amp;lt;InputText&amp;gt; snapshots = new Stack&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public InputText popSnapshot() {</span></span>
<span class="line"><span>    return snapshots.pop();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void pushSnapshot(InputText inputText) {</span></span>
<span class="line"><span>    InputText deepClonedInputText = new InputText();</span></span>
<span class="line"><span>    deepClonedInputText.setText(inputText.getText());</span></span>
<span class="line"><span>    snapshots.push(deepClonedInputText);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ApplicationMain {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    InputText inputText = new InputText();</span></span>
<span class="line"><span>    SnapshotHolder snapshotsHolder = new SnapshotHolder();</span></span>
<span class="line"><span>    Scanner scanner = new Scanner(System.in);</span></span>
<span class="line"><span>    while (scanner.hasNext()) {</span></span>
<span class="line"><span>      String input = scanner.next();</span></span>
<span class="line"><span>      if (input.equals(&amp;quot;:list&amp;quot;)) {</span></span>
<span class="line"><span>        System.out.println(inputText.getText());</span></span>
<span class="line"><span>      } else if (input.equals(&amp;quot;:undo&amp;quot;)) {</span></span>
<span class="line"><span>        InputText snapshot = snapshotsHolder.popSnapshot();</span></span>
<span class="line"><span>        inputText.setText(snapshot.getText());</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        snapshotsHolder.pushSnapshot(inputText);</span></span>
<span class="line"><span>        inputText.append(input);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，备忘录模式的实现很灵活，也没有很固定的实现方式，在不同的业务需求、不同编程语言下，代码实现可能都不大一样。上面的代码基本上已经实现了最基本的备忘录的功能。但是，如果我们深究一下的话，还有一些问题要解决，那就是前面定义中提到的第二点：要在不违背封装原则的前提下，进行对象的备份和恢复。而上面的代码并不满足这一点，主要体现在下面两方面：</p><ul><li>第一，为了能用快照恢复InputText对象，我们在InputText类中定义了setText()函数，但这个函数有可能会被其他业务使用，所以，暴露不应该暴露的函数违背了封装原则；</li><li>第二，快照本身是不可变的，理论上讲，不应该包含任何set()等修改内部状态的函数，但在上面的代码实现中，“快照“这个业务模型复用了InputText类的定义，而InputText类本身有一系列修改内部状态的函数，所以，用InputText类来表示快照违背了封装原则。</li></ul><p>针对以上问题，我们对代码做两点修改。其一，定义一个独立的类（Snapshot类）来表示快照，而不是复用InputText类。这个类只暴露get()方法，没有set()等任何修改内部状态的方法。其二，在InputText类中，我们把setText()方法重命名为restoreSnapshot()方法，用意更加明确，只用来恢复对象。</p><p>按照这个思路，我们对代码进行重构。重构之后的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class InputText {</span></span>
<span class="line"><span>  private StringBuilder text = new StringBuilder();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getText() {</span></span>
<span class="line"><span>    return text.toString();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void append(String input) {</span></span>
<span class="line"><span>    text.append(input);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Snapshot createSnapshot() {</span></span>
<span class="line"><span>    return new Snapshot(text.toString());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void restoreSnapshot(Snapshot snapshot) {</span></span>
<span class="line"><span>    this.text.replace(0, this.text.length(), snapshot.getText());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Snapshot {</span></span>
<span class="line"><span>  private String text;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Snapshot(String text) {</span></span>
<span class="line"><span>    this.text = text;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getText() {</span></span>
<span class="line"><span>    return this.text;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SnapshotHolder {</span></span>
<span class="line"><span>  private Stack&amp;lt;Snapshot&amp;gt; snapshots = new Stack&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Snapshot popSnapshot() {</span></span>
<span class="line"><span>    return snapshots.pop();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void pushSnapshot(Snapshot snapshot) {</span></span>
<span class="line"><span>    snapshots.push(snapshot);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ApplicationMain {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    InputText inputText = new InputText();</span></span>
<span class="line"><span>    SnapshotHolder snapshotsHolder = new SnapshotHolder();</span></span>
<span class="line"><span>    Scanner scanner = new Scanner(System.in);</span></span>
<span class="line"><span>    while (scanner.hasNext()) {</span></span>
<span class="line"><span>      String input = scanner.next();</span></span>
<span class="line"><span>      if (input.equals(&amp;quot;:list&amp;quot;)) {</span></span>
<span class="line"><span>        System.out.println(inputText.toString());</span></span>
<span class="line"><span>      } else if (input.equals(&amp;quot;:undo&amp;quot;)) {</span></span>
<span class="line"><span>        Snapshot snapshot = snapshotsHolder.popSnapshot();</span></span>
<span class="line"><span>        inputText.restoreSnapshot(snapshot);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        snapshotsHolder.pushSnapshot(inputText.createSnapshot());</span></span>
<span class="line"><span>        inputText.append(input);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，上面的代码实现就是典型的备忘录模式的代码实现，也是很多书籍（包括GoF的《设计模式》）中给出的实现方法。</p><p>除了备忘录模式，还有一个跟它很类似的概念，“备份”，它在我们平时的开发中更常听到。那备忘录模式跟“备份”有什么区别和联系呢？实际上，这两者的应用场景很类似，都应用在防丢失、恢复、撤销等场景中。它们的区别在于，备忘录模式更侧重于代码的设计和实现，备份更侧重架构设计或产品设计。这个不难理解，这里我就不多说了。</p><h2 id="如何优化内存和时间消耗" tabindex="-1"><a class="header-anchor" href="#如何优化内存和时间消耗"><span>如何优化内存和时间消耗？</span></a></h2><p>前面我们只是简单介绍了备忘录模式的原理和经典实现，现在我们再继续深挖一下。如果要备份的对象数据比较大，备份频率又比较高，那快照占用的内存会比较大，备份和恢复的耗时会比较长。这个问题该如何解决呢？</p><p>不同的应用场景下有不同的解决方法。比如，我们前面举的那个例子，应用场景是利用备忘录来实现撤销操作，而且仅仅支持顺序撤销，也就是说，每次操作只能撤销上一次的输入，不能跳过上次输入撤销之前的输入。在具有这样特点的应用场景下，为了节省内存，我们不需要在快照中存储完整的文本，只需要记录少许信息，比如在获取快照当下的文本长度，用这个值结合InputText类对象存储的文本来做撤销操作。</p><p>我们再举一个例子。假设每当有数据改动，我们都需要生成一个备份，以备之后恢复。如果需要备份的数据很大，这样高频率的备份，不管是对存储（内存或者硬盘）的消耗，还是对时间的消耗，都可能是无法接受的。想要解决这个问题，我们一般会采用“低频率全量备份”和“高频率增量备份”相结合的方法。</p><p>全量备份就不用讲了，它跟我们上面的例子类似，就是把所有的数据“拍个快照”保存下来。所谓“增量备份”，指的是记录每次操作或数据变动。</p><p>当我们需要恢复到某一时间点的备份的时候，如果这一时间点有做全量备份，我们直接拿来恢复就可以了。如果这一时间点没有对应的全量备份，我们就先找到最近的一次全量备份，然后用它来恢复，之后执行此次全量备份跟这一时间点之间的所有增量备份，也就是对应的操作或者数据变动。这样就能减少全量备份的数量和频率，减少对时间、内存的消耗。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>备忘录模式也叫快照模式，具体来说，就是在不违背封装原则的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便之后恢复对象为先前的状态。这个模式的定义表达了两部分内容：一部分是，存储副本以便后期恢复；另一部分是，要在不违背封装原则的前提下，进行对象的备份和恢复。</p><p>备忘录模式的应用场景也比较明确和有限，主要是用来防丢失、撤销、恢复等。它跟平时我们常说的“备份”很相似。两者的主要区别在于，备忘录模式更侧重于代码的设计和实现，备份更侧重架构设计或产品设计。</p><p>对于大对象的备份来说，备份占用的存储空间会比较大，备份和恢复的耗时会比较长。针对这个问题，不同的业务场景有不同的处理方式。比如，只备份必要的恢复信息，结合最新的数据来恢复；再比如，全量备份和增量备份相结合，低频全量备份，高频增量备份，两者结合来做恢复。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><p>今天我们讲到，备份在架构或产品设计中比较常见，比如，重启Chrome可以选择恢复之前打开的页面，你还能想到其他类似的应用场景吗？</p><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,38)]))}const r=s(e,[["render",l]]),u=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E8%A1%8C%E4%B8%BA%E5%9E%8B/70%20_%20%E5%A4%87%E5%BF%98%E5%BD%95%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%AF%B9%E4%BA%8E%E5%A4%A7%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%A4%87%E4%BB%BD%E5%92%8C%E6%81%A2%E5%A4%8D%EF%BC%8C%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96%E5%86%85%E5%AD%98%E5%92%8C%E6%97%B6%E9%97%B4%E7%9A%84%E6%B6%88%E8%80%97%EF%BC%9F.html","title":"70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？","lang":"zh-CN","frontmatter":{"description":"70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？ 上两节课，我们学习了访问者模式。在23种设计模式中，访问者模式的原理和实现可以说是最难理解的了，特别是它的代码实现。其中，用Single Dispatch来模拟Double Dispatch的实现思路尤其不好理解。不知道你有没有将它拿下呢？如果还没有弄得很清楚，那就要多看几遍、多...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E8%A1%8C%E4%B8%BA%E5%9E%8B/70%20_%20%E5%A4%87%E5%BF%98%E5%BD%95%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%AF%B9%E4%BA%8E%E5%A4%A7%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%A4%87%E4%BB%BD%E5%92%8C%E6%81%A2%E5%A4%8D%EF%BC%8C%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96%E5%86%85%E5%AD%98%E5%92%8C%E6%97%B6%E9%97%B4%E7%9A%84%E6%B6%88%E8%80%97%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？"}],["meta",{"property":"og:description","content":"70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？ 上两节课，我们学习了访问者模式。在23种设计模式中，访问者模式的原理和实现可以说是最难理解的了，特别是它的代码实现。其中，用Single Dispatch来模拟Double Dispatch的实现思路尤其不好理解。不知道你有没有将它拿下呢？如果还没有弄得很清楚，那就要多看几遍、多..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":8.88,"words":2664},"filePathRelative":"posts/设计模式之美/设计模式与范式：行为型/70 _ 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"70 | 备忘录模式：对于大对象的备份和恢复，如何优化内存和时间的消耗？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/c5/11/c516c58085171935bcf176471c63b711.mp3\\"></audio></p>\\n<p>上两节课，我们学习了访问者模式。在23种设计模式中，访问者模式的原理和实现可以说是最难理解的了，特别是它的代码实现。其中，用Single Dispatch来模拟Double Dispatch的实现思路尤其不好理解。不知道你有没有将它拿下呢？如果还没有弄得很清楚，那就要多看几遍、多自己动脑经琢磨一下。</p>","autoDesc":true}');export{r as comp,u as data};
