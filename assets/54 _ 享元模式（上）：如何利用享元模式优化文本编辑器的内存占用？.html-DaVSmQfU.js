import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-CrA-f6So.js";const p={};function l(c,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="_54-享元模式-上-如何利用享元模式优化文本编辑器的内存占用" tabindex="-1"><a class="header-anchor" href="#_54-享元模式-上-如何利用享元模式优化文本编辑器的内存占用"><span>54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？</span></a></h1><p><audio id="audio" title="54 | 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/35/68/35f47cc3ddc2134caefb978d60ef8a68.mp3"></audio></p><p>上一节课中，我们讲了组合模式。组合模式并不常用，主要用在数据能表示成树形结构、能通过树的遍历算法来解决的场景中。今天，我们再来学习一个不那么常用的模式，<strong>享元模式</strong>（Flyweight Design Pattern）。这也是我们要学习的最后一个结构型模式。</p><p>跟其他所有的设计模式类似，享元模式的原理和实现也非常简单。今天，我会通过棋牌游戏和文本编辑器两个实际的例子来讲解。除此之外，我还会讲到它跟单例、缓存、对象池的区别和联系。在下一节课中，我会带你剖析一下享元模式在Java Integer、String中的应用。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="享元模式原理与实现" tabindex="-1"><a class="header-anchor" href="#享元模式原理与实现"><span>享元模式原理与实现</span></a></h2><p>所谓“享元”，顾名思义就是被共享的单元。享元模式的意图是复用对象，节省内存，前提是享元对象是不可变对象。</p><p>具体来讲，当一个系统中存在大量重复对象的时候，如果这些重复的对象是不可变对象，我们就可以利用享元模式将对象设计成享元，在内存中只保留一份实例，供多处代码引用。这样可以减少内存中对象的数量，起到节省内存的目的。实际上，不仅仅相同对象可以设计成享元，对于相似对象，我们也可以将这些对象中相同的部分（字段）提取出来，设计成享元，让这些大量相似对象引用这些享元。</p><p>这里我稍微解释一下，定义中的“不可变对象”指的是，一旦通过构造函数初始化完成之后，它的状态（对象的成员变量或者属性）就不会再被修改了。所以，不可变对象不能暴露任何set()等修改内部状态的方法。之所以要求享元是不可变对象，那是因为它会被多处代码共享使用，避免一处代码对享元进行了修改，影响到其他使用它的代码。</p><p>接下来，我们通过一个简单的例子解释一下享元模式。</p><p>假设我们在开发一个棋牌游戏（比如象棋）。一个游戏厅中有成千上万个“房间”，每个房间对应一个棋局。棋局要保存每个棋子的数据，比如：棋子类型（将、相、士、炮等）、棋子颜色（红方、黑方）、棋子在棋局中的位置。利用这些数据，我们就能显示一个完整的棋盘给玩家。具体的代码如下所示。其中，ChessPiece类表示棋子，ChessBoard类表示一个棋局，里面保存了象棋中30个棋子的信息。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class ChessPiece {//棋子</span></span>
<span class="line"><span>  private int id;</span></span>
<span class="line"><span>  private String text;</span></span>
<span class="line"><span>  private Color color;</span></span>
<span class="line"><span>  private int positionX;</span></span>
<span class="line"><span>  private int positionY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ChessPiece(int id, String text, Color color, int positionX, int positionY) {</span></span>
<span class="line"><span>    this.id = id;</span></span>
<span class="line"><span>    this.text = text;</span></span>
<span class="line"><span>    this.color = color;</span></span>
<span class="line"><span>    this.positionX = positionX;</span></span>
<span class="line"><span>    this.positionY = positionX;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static enum Color {</span></span>
<span class="line"><span>    RED, BLACK</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // ...省略其他属性和getter/setter方法...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ChessBoard {//棋局</span></span>
<span class="line"><span>  private Map&amp;lt;Integer, ChessPiece&amp;gt; chessPieces = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ChessBoard() {</span></span>
<span class="line"><span>    init();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void init() {</span></span>
<span class="line"><span>    chessPieces.put(1, new ChessPiece(1, &amp;quot;車&amp;quot;, ChessPiece.Color.BLACK, 0, 0));</span></span>
<span class="line"><span>    chessPieces.put(2, new ChessPiece(2,&amp;quot;馬&amp;quot;, ChessPiece.Color.BLACK, 0, 1));</span></span>
<span class="line"><span>    //...省略摆放其他棋子的代码...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void move(int chessPieceId, int toPositionX, int toPositionY) {</span></span>
<span class="line"><span>    //...省略...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了记录每个房间当前的棋局情况，我们需要给每个房间都创建一个ChessBoard棋局对象。因为游戏大厅中有成千上万的房间（实际上，百万人同时在线的游戏大厅也有很多），那保存这么多棋局对象就会消耗大量的内存。有没有什么办法来节省内存呢？</p><p>这个时候，享元模式就可以派上用场了。像刚刚的实现方式，在内存中会有大量的相似对象。这些相似对象的id、text、color都是相同的，唯独positionX、positionY不同。实际上，我们可以将棋子的id、text、color属性拆分出来，设计成独立的类，并且作为享元供多个棋盘复用。这样，棋盘只需要记录每个棋子的位置信息就可以了。具体的代码实现如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 享元类</span></span>
<span class="line"><span>public class ChessPieceUnit {</span></span>
<span class="line"><span>  private int id;</span></span>
<span class="line"><span>  private String text;</span></span>
<span class="line"><span>  private Color color;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ChessPieceUnit(int id, String text, Color color) {</span></span>
<span class="line"><span>    this.id = id;</span></span>
<span class="line"><span>    this.text = text;</span></span>
<span class="line"><span>    this.color = color;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static enum Color {</span></span>
<span class="line"><span>    RED, BLACK</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // ...省略其他属性和getter方法...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ChessPieceUnitFactory {</span></span>
<span class="line"><span>  private static final Map&amp;lt;Integer, ChessPieceUnit&amp;gt; pieces = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  static {</span></span>
<span class="line"><span>    pieces.put(1, new ChessPieceUnit(1, &amp;quot;車&amp;quot;, ChessPieceUnit.Color.BLACK));</span></span>
<span class="line"><span>    pieces.put(2, new ChessPieceUnit(2,&amp;quot;馬&amp;quot;, ChessPieceUnit.Color.BLACK));</span></span>
<span class="line"><span>    //...省略摆放其他棋子的代码...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static ChessPieceUnit getChessPiece(int chessPieceId) {</span></span>
<span class="line"><span>    return pieces.get(chessPieceId);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ChessPiece {</span></span>
<span class="line"><span>  private ChessPieceUnit chessPieceUnit;</span></span>
<span class="line"><span>  private int positionX;</span></span>
<span class="line"><span>  private int positionY;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ChessPiece(ChessPieceUnit unit, int positionX, int positionY) {</span></span>
<span class="line"><span>    this.chessPieceUnit = unit;</span></span>
<span class="line"><span>    this.positionX = positionX;</span></span>
<span class="line"><span>    this.positionY = positionY;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 省略getter、setter方法</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ChessBoard {</span></span>
<span class="line"><span>  private Map&amp;lt;Integer, ChessPiece&amp;gt; chessPieces = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public ChessBoard() {</span></span>
<span class="line"><span>    init();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void init() {</span></span>
<span class="line"><span>    chessPieces.put(1, new ChessPiece(</span></span>
<span class="line"><span>            ChessPieceUnitFactory.getChessPiece(1), 0,0));</span></span>
<span class="line"><span>    chessPieces.put(1, new ChessPiece(</span></span>
<span class="line"><span>            ChessPieceUnitFactory.getChessPiece(2), 1,0));</span></span>
<span class="line"><span>    //...省略摆放其他棋子的代码...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void move(int chessPieceId, int toPositionX, int toPositionY) {</span></span>
<span class="line"><span>    //...省略...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码实现中，我们利用工厂类来缓存ChessPieceUnit信息（也就是id、text、color）。通过工厂类获取到的ChessPieceUnit就是享元。所有的ChessBoard对象共享这30个ChessPieceUnit对象（因为象棋中只有30个棋子）。在使用享元模式之前，记录1万个棋局，我们要创建30万（30*1万）个棋子的ChessPieceUnit对象。利用享元模式，我们只需要创建30个享元对象供所有棋局共享使用即可，大大节省了内存。</p><p>那享元模式的原理讲完了，我们来总结一下它的代码结构。实际上，它的代码实现非常简单，主要是通过工厂模式，在工厂类中，通过一个Map来缓存已经创建过的享元对象，来达到复用的目的。</p><h2 id="享元模式在文本编辑器中的应用" tabindex="-1"><a class="header-anchor" href="#享元模式在文本编辑器中的应用"><span>享元模式在文本编辑器中的应用</span></a></h2><p>弄懂了享元模式的原理和实现之后，我们再来看另外一个例子，也就是文章标题中给出的：如何利用享元模式来优化文本编辑器的内存占用？</p><p>你可以把这里提到的文本编辑器想象成Office的Word。不过，为了简化需求背景，我们假设这个文本编辑器只实现了文字编辑功能，不包含图片、表格等复杂的编辑功能。对于简化之后的文本编辑器，我们要在内存中表示一个文本文件，只需要记录文字和格式两部分信息就可以了，其中，格式又包括文字的字体、大小、颜色等信息。</p><p>尽管在实际的文档编写中，我们一般都是按照文本类型（标题、正文……）来设置文字的格式，标题是一种格式，正文是另一种格式等等。但是，从理论上讲，我们可以给文本文件中的每个文字都设置不同的格式。为了实现如此灵活的格式设置，并且代码实现又不过于太复杂，我们把每个文字都当作一个独立的对象来看待，并且在其中包含它的格式信息。具体的代码示例如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Character {//文字</span></span>
<span class="line"><span>  private char c;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private Font font;</span></span>
<span class="line"><span>  private int size;</span></span>
<span class="line"><span>  private int colorRGB;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Character(char c, Font font, int size, int colorRGB) {</span></span>
<span class="line"><span>    this.c = c;</span></span>
<span class="line"><span>    this.font = font;</span></span>
<span class="line"><span>    this.size = size;</span></span>
<span class="line"><span>    this.colorRGB = colorRGB;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Editor {</span></span>
<span class="line"><span>  private List&amp;lt;Character&amp;gt; chars = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void appendCharacter(char c, Font font, int size, int colorRGB) {</span></span>
<span class="line"><span>    Character character = new Character(c, font, size, colorRGB);</span></span>
<span class="line"><span>    chars.add(character);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在文本编辑器中，我们每敲一个文字，都会调用Editor类中的appendCharacter()方法，创建一个新的Character对象，保存到chars数组中。如果一个文本文件中，有上万、十几万、几十万的文字，那我们就要在内存中存储这么多Character对象。那有没有办法可以节省一点内存呢？</p><p>实际上，在一个文本文件中，用到的字体格式不会太多，毕竟不大可能有人把每个文字都设置成不同的格式。所以，对于字体格式，我们可以将它设计成享元，让不同的文字共享使用。按照这个设计思路，我们对上面的代码进行重构。重构后的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class CharacterStyle {</span></span>
<span class="line"><span>  private Font font;</span></span>
<span class="line"><span>  private int size;</span></span>
<span class="line"><span>  private int colorRGB;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public CharacterStyle(Font font, int size, int colorRGB) {</span></span>
<span class="line"><span>    this.font = font;</span></span>
<span class="line"><span>    this.size = size;</span></span>
<span class="line"><span>    this.colorRGB = colorRGB;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public boolean equals(Object o) {</span></span>
<span class="line"><span>    CharacterStyle otherStyle = (CharacterStyle) o;</span></span>
<span class="line"><span>    return font.equals(otherStyle.font)</span></span>
<span class="line"><span>            &amp;amp;&amp;amp; size == otherStyle.size</span></span>
<span class="line"><span>            &amp;amp;&amp;amp; colorRGB == otherStyle.colorRGB;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class CharacterStyleFactory {</span></span>
<span class="line"><span>  private static final List&amp;lt;CharacterStyle&amp;gt; styles = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static CharacterStyle getStyle(Font font, int size, int colorRGB) {</span></span>
<span class="line"><span>    CharacterStyle newStyle = new CharacterStyle(font, size, colorRGB);</span></span>
<span class="line"><span>    for (CharacterStyle style : styles) {</span></span>
<span class="line"><span>      if (style.equals(newStyle)) {</span></span>
<span class="line"><span>        return style;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    styles.add(newStyle);</span></span>
<span class="line"><span>    return newStyle;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Character {</span></span>
<span class="line"><span>  private char c;</span></span>
<span class="line"><span>  private CharacterStyle style;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Character(char c, CharacterStyle style) {</span></span>
<span class="line"><span>    this.c = c;</span></span>
<span class="line"><span>    this.style = style;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Editor {</span></span>
<span class="line"><span>  private List&amp;lt;Character&amp;gt; chars = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void appendCharacter(char c, Font font, int size, int colorRGB) {</span></span>
<span class="line"><span>    Character character = new Character(c, CharacterStyleFactory.getStyle(font, size, colorRGB));</span></span>
<span class="line"><span>    chars.add(character);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="享元模式vs单例、缓存、对象池" tabindex="-1"><a class="header-anchor" href="#享元模式vs单例、缓存、对象池"><span>享元模式vs单例、缓存、对象池</span></a></h2><p>在上面的讲解中，我们多次提到“共享”“缓存”“复用”这些字眼，那它跟单例、缓存、对象池这些概念有什么区别呢？我们来简单对比一下。</p><p><strong>我们先来看享元模式跟单例的区别。</strong></p><p>在单例模式中，一个类只能创建一个对象，而在享元模式中，一个类可以创建多个对象，每个对象被多处代码引用共享。实际上，享元模式有点类似于之前讲到的单例的变体：多例。</p><p>我们前面也多次提到，区别两种设计模式，不能光看代码实现，而是要看设计意图，也就是要解决的问题。尽管从代码实现上来看，享元模式和多例有很多相似之处，但从设计意图上来看，它们是完全不同的。应用享元模式是为了对象复用，节省内存，而应用多例模式是为了限制对象的个数。</p><p><strong>我们再来看享元模式跟缓存的区别。</strong></p><p>在享元模式的实现中，我们通过工厂类来“缓存”已经创建好的对象。这里的“缓存”实际上是“存储”的意思，跟我们平时所说的“数据库缓存”“CPU缓存”“MemCache缓存”是两回事。我们平时所讲的缓存，主要是为了提高访问效率，而非复用。</p><p><strong>最后我们来看享元模式跟对象池的区别。</strong></p><p>对象池、连接池（比如数据库连接池）、线程池等也是为了复用，那它们跟享元模式有什么区别呢？</p><p>你可能对连接池、线程池比较熟悉，对对象池比较陌生，所以，这里我简单解释一下对象池。像C++这样的编程语言，内存的管理是由程序员负责的。为了避免频繁地进行对象创建和释放导致内存碎片，我们可以预先申请一片连续的内存空间，也就是这里说的对象池。每次创建对象时，我们从对象池中直接取出一个空闲对象来使用，对象使用完成之后，再放回到对象池中以供后续复用，而非直接释放掉。</p><p>虽然对象池、连接池、线程池、享元模式都是为了复用，但是，如果我们再细致地抠一抠“复用”这个字眼的话，对象池、连接池、线程池等池化技术中的“复用”和享元模式中的“复用”实际上是不同的概念。</p><p>池化技术中的“复用”可以理解为“重复使用”，主要目的是节省时间（比如从数据库池中取一个连接，不需要重新创建）。在任意时刻，每一个对象、连接、线程，并不会被多处使用，而是被一个使用者独占，当使用完成之后，放回到池中，再由其他使用者重复利用。享元模式中的“复用”可以理解为“共享使用”，在整个生命周期中，都是被所有使用者共享的，主要目的是节省空间。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。我们来一块总结回顾一下，你需要重点掌握的内容。</p><p><strong>1.享元模式的原理</strong></p><p>所谓“享元”，顾名思义就是被共享的单元。享元模式的意图是复用对象，节省内存，前提是享元对象是不可变对象。具体来讲，当一个系统中存在大量重复对象的时候，我们就可以利用享元模式，将对象设计成享元，在内存中只保留一份实例，供多处代码引用，这样可以减少内存中对象的数量，以起到节省内存的目的。实际上，不仅仅相同对象可以设计成享元，对于相似对象，我们也可以将这些对象中相同的部分（字段），提取出来设计成享元，让这些大量相似对象引用这些享元。</p><p><strong>2.享元模式的实现</strong></p><p>享元模式的代码实现非常简单，主要是通过工厂模式，在工厂类中，通过一个Map或者List来缓存已经创建好的享元对象，以达到复用的目的。</p><p><strong>3.享元模式VS单例、缓存、对象池</strong></p><p>我们前面也多次提到，区别两种设计模式，不能光看代码实现，而是要看设计意图，也就是要解决的问题。这里的区别也不例外。</p><p>我们可以用简单几句话来概括一下它们之间的区别。应用单例模式是为了保证对象全局唯一。应用享元模式是为了实现对象复用，节省内存。缓存是为了提高访问效率，而非复用。池化技术中的“复用”理解为“重复使用”，主要是为了节省时间。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><ol><li>在棋牌游戏的例子中，有没有必要把ChessPiecePosition设计成享元呢？</li><li>在文本编辑器的例子中，调用CharacterStyleFactory类的getStyle()方法，需要在styles数组中遍历查找，而遍历查找比较耗时，是否可以优化一下呢？</li></ol><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,49)]))}const d=n(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E7%BB%93%E6%9E%84%E5%9E%8B/54%20_%20%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%B8%8A%EF%BC%89%EF%BC%9A%E5%A6%82%E4%BD%95%E5%88%A9%E7%94%A8%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F%E4%BC%98%E5%8C%96%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8%E7%9A%84%E5%86%85%E5%AD%98%E5%8D%A0%E7%94%A8%EF%BC%9F.html","title":"54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？","lang":"zh-CN","frontmatter":{"description":"54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？ 上一节课中，我们讲了组合模式。组合模式并不常用，主要用在数据能表示成树形结构、能通过树的遍历算法来解决的场景中。今天，我们再来学习一个不那么常用的模式，享元模式（Flyweight Design Pattern）。这也是我们要学习的最后一个结构型模式。 跟其他所有的设计模式类似，享元...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E7%BB%93%E6%9E%84%E5%9E%8B/54%20_%20%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%B8%8A%EF%BC%89%EF%BC%9A%E5%A6%82%E4%BD%95%E5%88%A9%E7%94%A8%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F%E4%BC%98%E5%8C%96%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8%E7%9A%84%E5%86%85%E5%AD%98%E5%8D%A0%E7%94%A8%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？"}],["meta",{"property":"og:description","content":"54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？ 上一节课中，我们讲了组合模式。组合模式并不常用，主要用在数据能表示成树形结构、能通过树的遍历算法来解决的场景中。今天，我们再来学习一个不那么常用的模式，享元模式（Flyweight Design Pattern）。这也是我们要学习的最后一个结构型模式。 跟其他所有的设计模式类似，享元..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":12.43,"words":3729},"filePathRelative":"posts/设计模式之美/设计模式与范式：结构型/54 _ 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"54 | 享元模式（上）：如何利用享元模式优化文本编辑器的内存占用？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/35/68/35f47cc3ddc2134caefb978d60ef8a68.mp3\\"></audio></p>\\n<p>上一节课中，我们讲了组合模式。组合模式并不常用，主要用在数据能表示成树形结构、能通过树的遍历算法来解决的场景中。今天，我们再来学习一个不那么常用的模式，<strong>享元模式</strong>（Flyweight Design Pattern）。这也是我们要学习的最后一个结构型模式。</p>","autoDesc":true}');export{d as comp,v as data};
