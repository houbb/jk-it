import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<p><audio id="audio" title="53 | 组合模式：如何设计实现支持递归遍历的文件系统目录树结构？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/b3/fe/b337355b2a4c41b4a35a477acd369dfe.mp3"></audio></p><p>结构型设计模式就快要讲完了，还剩下两个不那么常用的：组合模式和享元模式。今天，我们来讲一下<strong>组合模式</strong>（Composite Design Pattern）。</p><p>组合模式跟我们之前讲的面向对象设计中的“组合关系（通过组合来组装两个类）”，完全是两码事。这里讲的“组合模式”，主要是用来处理树形结构数据。这里的“数据”，你可以简单理解为一组对象集合，待会我们会详细讲解。</p><p>正因为其应用场景的特殊性，数据必须能表示成树形结构，这也导致了这种模式在实际的项目开发中并不那么常用。但是，一旦数据满足树形结构，应用这种模式就能发挥很大的作用，能让代码变得非常简洁。</p><p>话不多说，让我们正式开始今天的学习吧！</p><h2 id="组合模式的原理与实现" tabindex="-1"><a class="header-anchor" href="#组合模式的原理与实现"><span>组合模式的原理与实现</span></a></h2><p>在GoF的《设计模式》一书中，组合模式是这样定义的：</p><blockquote></blockquote><p>Compose objects into tree structure to represent part-whole hierarchies.Composite lets client treat individual objects and compositions of objects uniformly.</p><p>翻译成中文就是：将一组对象组织（Compose）成树形结构，以表示一种“部分-整体”的层次结构。组合让客户端（在很多设计模式书籍中，“客户端”代指代码的使用者。）可以统一单个对象和组合对象的处理逻辑。</p><p>接下来，对于组合模式，我举个例子来给你解释一下。</p><p>假设我们有这样一个需求：设计一个类来表示文件系统中的目录，能方便地实现下面这些功能：</p><ul><li>动态地添加、删除某个目录下的子目录或文件；</li><li>统计指定目录下的文件个数；</li><li>统计指定目录下的文件总大小。</li></ul><p>我这里给出了这个类的骨架代码，如下所示。其中的核心逻辑并未实现，你可以试着自己去补充完整，再来看我的讲解。在下面的代码实现中，我们把文件和目录统一用FileSystemNode类来表示，并且通过isFile属性来区分。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class FileSystemNode {</span></span>
<span class="line"><span>  private String path;</span></span>
<span class="line"><span>  private boolean isFile;</span></span>
<span class="line"><span>  private List&amp;lt;FileSystemNode&amp;gt; subNodes = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public FileSystemNode(String path, boolean isFile) {</span></span>
<span class="line"><span>    this.path = path;</span></span>
<span class="line"><span>    this.isFile = isFile;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public int countNumOfFiles() {</span></span>
<span class="line"><span>    // TODO:...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public long countSizeOfFiles() {</span></span>
<span class="line"><span>    // TODO:...</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getPath() {</span></span>
<span class="line"><span>    return path;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addSubNode(FileSystemNode fileOrDir) {</span></span>
<span class="line"><span>    subNodes.add(fileOrDir);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void removeSubNode(FileSystemNode fileOrDir) {</span></span>
<span class="line"><span>    int size = subNodes.size();</span></span>
<span class="line"><span>    int i = 0;</span></span>
<span class="line"><span>    for (; i &amp;lt; size; ++i) {</span></span>
<span class="line"><span>      if (subNodes.get(i).getPath().equalsIgnoreCase(fileOrDir.getPath())) {</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (i &amp;lt; size) {</span></span>
<span class="line"><span>      subNodes.remove(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，如果你看过我的《数据结构与算法之美》专栏，想要补全其中的countNumOfFiles()和countSizeOfFiles()这两个函数，并不是件难事，实际上这就是树上的递归遍历算法。对于文件，我们直接返回文件的个数（返回1）或大小。对于目录，我们遍历目录中每个子目录或者文件，递归计算它们的个数或大小，然后求和，就是这个目录下的文件个数和文件大小。</p><p>我把两个函数的代码实现贴在下面了，你可以对照着看一下。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  public int countNumOfFiles() {</span></span>
<span class="line"><span>    if (isFile) {</span></span>
<span class="line"><span>      return 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int numOfFiles = 0;</span></span>
<span class="line"><span>    for (FileSystemNode fileOrDir : subNodes) {</span></span>
<span class="line"><span>      numOfFiles += fileOrDir.countNumOfFiles();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return numOfFiles;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public long countSizeOfFiles() {</span></span>
<span class="line"><span>    if (isFile) {</span></span>
<span class="line"><span>      File file = new File(path);</span></span>
<span class="line"><span>      if (!file.exists()) return 0;</span></span>
<span class="line"><span>      return file.length();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    long sizeofFiles = 0;</span></span>
<span class="line"><span>    for (FileSystemNode fileOrDir : subNodes) {</span></span>
<span class="line"><span>      sizeofFiles += fileOrDir.countSizeOfFiles();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sizeofFiles;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>单纯从功能实现角度来说，上面的代码没有问题，已经实现了我们想要的功能。但是，如果我们开发的是一个大型系统，从扩展性（文件或目录可能会对应不同的操作）、业务建模（文件和目录从业务上是两个概念）、代码的可读性（文件和目录区分对待更加符合人们对业务的认知）的角度来说，我们最好对文件和目录进行区分设计，定义为File和Directory两个类。</p><p>按照这个设计思路，我们对代码进行重构。重构之后的代码如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public abstract class FileSystemNode {</span></span>
<span class="line"><span>  protected String path;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public FileSystemNode(String path) {</span></span>
<span class="line"><span>    this.path = path;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public abstract int countNumOfFiles();</span></span>
<span class="line"><span>  public abstract long countSizeOfFiles();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public String getPath() {</span></span>
<span class="line"><span>    return path;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class File extends FileSystemNode {</span></span>
<span class="line"><span>  public File(String path) {</span></span>
<span class="line"><span>    super(path);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public int countNumOfFiles() {</span></span>
<span class="line"><span>    return 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public long countSizeOfFiles() {</span></span>
<span class="line"><span>    java.io.File file = new java.io.File(path);</span></span>
<span class="line"><span>    if (!file.exists()) return 0;</span></span>
<span class="line"><span>    return file.length();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Directory extends FileSystemNode {</span></span>
<span class="line"><span>  private List&amp;lt;FileSystemNode&amp;gt; subNodes = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Directory(String path) {</span></span>
<span class="line"><span>    super(path);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public int countNumOfFiles() {</span></span>
<span class="line"><span>    int numOfFiles = 0;</span></span>
<span class="line"><span>    for (FileSystemNode fileOrDir : subNodes) {</span></span>
<span class="line"><span>      numOfFiles += fileOrDir.countNumOfFiles();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return numOfFiles;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public long countSizeOfFiles() {</span></span>
<span class="line"><span>    long sizeofFiles = 0;</span></span>
<span class="line"><span>    for (FileSystemNode fileOrDir : subNodes) {</span></span>
<span class="line"><span>      sizeofFiles += fileOrDir.countSizeOfFiles();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return sizeofFiles;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addSubNode(FileSystemNode fileOrDir) {</span></span>
<span class="line"><span>    subNodes.add(fileOrDir);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void removeSubNode(FileSystemNode fileOrDir) {</span></span>
<span class="line"><span>    int size = subNodes.size();</span></span>
<span class="line"><span>    int i = 0;</span></span>
<span class="line"><span>    for (; i &amp;lt; size; ++i) {</span></span>
<span class="line"><span>      if (subNodes.get(i).getPath().equalsIgnoreCase(fileOrDir.getPath())) {</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (i &amp;lt; size) {</span></span>
<span class="line"><span>      subNodes.remove(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>文件和目录类都设计好了，我们来看，如何用它们来表示一个文件系统中的目录树结构。具体的代码示例如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * /</span></span>
<span class="line"><span>     * /wz/</span></span>
<span class="line"><span>     * /wz/a.txt</span></span>
<span class="line"><span>     * /wz/b.txt</span></span>
<span class="line"><span>     * /wz/movies/</span></span>
<span class="line"><span>     * /wz/movies/c.avi</span></span>
<span class="line"><span>     * /xzg/</span></span>
<span class="line"><span>     * /xzg/docs/</span></span>
<span class="line"><span>     * /xzg/docs/d.txt</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    Directory fileSystemTree = new Directory(&amp;quot;/&amp;quot;);</span></span>
<span class="line"><span>    Directory node_wz = new Directory(&amp;quot;/wz/&amp;quot;);</span></span>
<span class="line"><span>    Directory node_xzg = new Directory(&amp;quot;/xzg/&amp;quot;);</span></span>
<span class="line"><span>    fileSystemTree.addSubNode(node_wz);</span></span>
<span class="line"><span>    fileSystemTree.addSubNode(node_xzg);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    File node_wz_a = new File(&amp;quot;/wz/a.txt&amp;quot;);</span></span>
<span class="line"><span>    File node_wz_b = new File(&amp;quot;/wz/b.txt&amp;quot;);</span></span>
<span class="line"><span>    Directory node_wz_movies = new Directory(&amp;quot;/wz/movies/&amp;quot;);</span></span>
<span class="line"><span>    node_wz.addSubNode(node_wz_a);</span></span>
<span class="line"><span>    node_wz.addSubNode(node_wz_b);</span></span>
<span class="line"><span>    node_wz.addSubNode(node_wz_movies);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    File node_wz_movies_c = new File(&amp;quot;/wz/movies/c.avi&amp;quot;);</span></span>
<span class="line"><span>    node_wz_movies.addSubNode(node_wz_movies_c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Directory node_xzg_docs = new Directory(&amp;quot;/xzg/docs/&amp;quot;);</span></span>
<span class="line"><span>    node_xzg.addSubNode(node_xzg_docs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    File node_xzg_docs_d = new File(&amp;quot;/xzg/docs/d.txt&amp;quot;);</span></span>
<span class="line"><span>    node_xzg_docs.addSubNode(node_xzg_docs_d);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&amp;quot;/ files num:&amp;quot; + fileSystemTree.countNumOfFiles());</span></span>
<span class="line"><span>    System.out.println(&amp;quot;/wz/ files num:&amp;quot; + node_wz.countNumOfFiles());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们对照着这个例子，再重新看一下组合模式的定义：“将一组对象（文件和目录）组织成树形结构，以表示一种‘部分-整体’的层次结构（目录与子目录的嵌套结构）。组合模式让客户端可以统一单个对象（文件）和组合对象（目录）的处理逻辑（递归遍历）。”</p><p>实际上，刚才讲的这种组合模式的设计思路，与其说是一种设计模式，倒不如说是对业务场景的一种数据结构和算法的抽象。其中，数据可以表示成树这种数据结构，业务需求可以通过在树上的递归遍历算法来实现。</p><h2 id="组合模式的应用场景举例" tabindex="-1"><a class="header-anchor" href="#组合模式的应用场景举例"><span>组合模式的应用场景举例</span></a></h2><p>刚刚我们讲了文件系统的例子，对于组合模式，我这里再举一个例子。搞懂了这两个例子，你基本上就算掌握了组合模式。在实际的项目中，遇到类似的可以表示成树形结构的业务场景，你只要“照葫芦画瓢”去设计就可以了。</p><p>假设我们在开发一个OA系统（办公自动化系统）。公司的组织结构包含部门和员工两种数据类型。其中，部门又可以包含子部门和员工。在数据库中的表结构如下所示：</p><img src="https://static001.geekbang.org/resource/image/5b/8b/5b19dc0c296f728328794eab1f16a38b.jpg" alt=""><p>我们希望在内存中构建整个公司的人员架构图（部门、子部门、员工的隶属关系），并且提供接口计算出部门的薪资成本（隶属于这个部门的所有员工的薪资和）。</p><p>部门包含子部门和员工，这是一种嵌套结构，可以表示成树这种数据结构。计算每个部门的薪资开支这样一个需求，也可以通过在树上的遍历算法来实现。所以，从这个角度来看，这个应用场景可以使用组合模式来设计和实现。</p><p>这个例子的代码结构跟上一个例子的很相似，代码实现我直接贴在了下面，你可以对比着看一下。其中，HumanResource是部门类（Department）和员工类（Employee）抽象出来的父类，为的是能统一薪资的处理逻辑。Demo中的代码负责从数据库中读取数据并在内存中构建组织架构图。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public abstract class HumanResource {</span></span>
<span class="line"><span>  protected long id;</span></span>
<span class="line"><span>  protected double salary;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public HumanResource(long id) {</span></span>
<span class="line"><span>    this.id = id;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public long getId() {</span></span>
<span class="line"><span>    return id;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public abstract double calculateSalary();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Employee extends HumanResource {</span></span>
<span class="line"><span>  public Employee(long id, double salary) {</span></span>
<span class="line"><span>    super(id);</span></span>
<span class="line"><span>    this.salary = salary;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public double calculateSalary() {</span></span>
<span class="line"><span>    return salary;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Department extends HumanResource {</span></span>
<span class="line"><span>  private List&amp;lt;HumanResource&amp;gt; subNodes = new ArrayList&amp;lt;&amp;gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Department(long id) {</span></span>
<span class="line"><span>    super(id);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public double calculateSalary() {</span></span>
<span class="line"><span>    double totalSalary = 0;</span></span>
<span class="line"><span>    for (HumanResource hr : subNodes) {</span></span>
<span class="line"><span>      totalSalary += hr.calculateSalary();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this.salary = totalSalary;</span></span>
<span class="line"><span>    return totalSalary;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void addSubNode(HumanResource hr) {</span></span>
<span class="line"><span>    subNodes.add(hr);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 构建组织架构的代码</span></span>
<span class="line"><span>public class Demo {</span></span>
<span class="line"><span>  private static final long ORGANIZATION_ROOT_ID = 1001;</span></span>
<span class="line"><span>  private DepartmentRepo departmentRepo; // 依赖注入</span></span>
<span class="line"><span>  private EmployeeRepo employeeRepo; // 依赖注入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void buildOrganization() {</span></span>
<span class="line"><span>    Department rootDepartment = new Department(ORGANIZATION_ROOT_ID);</span></span>
<span class="line"><span>    buildOrganization(rootDepartment);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  private void buildOrganization(Department department) {</span></span>
<span class="line"><span>    List&amp;lt;Long&amp;gt; subDepartmentIds = departmentRepo.getSubDepartmentIds(department.getId());</span></span>
<span class="line"><span>    for (Long subDepartmentId : subDepartmentIds) {</span></span>
<span class="line"><span>      Department subDepartment = new Department(subDepartmentId);</span></span>
<span class="line"><span>      department.addSubNode(subDepartment);</span></span>
<span class="line"><span>      buildOrganization(subDepartment);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    List&amp;lt;Long&amp;gt; employeeIds = employeeRepo.getDepartmentEmployeeIds(department.getId());</span></span>
<span class="line"><span>    for (Long employeeId : employeeIds) {</span></span>
<span class="line"><span>      double salary = employeeRepo.getEmployeeSalary(employeeId);</span></span>
<span class="line"><span>      department.addSubNode(new Employee(employeeId, salary));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们再拿组合模式的定义跟这个例子对照一下：“将一组对象（员工和部门）组织成树形结构，以表示一种‘部分-整体’的层次结构（部门与子部门的嵌套结构）。组合模式让客户端可以统一单个对象（员工）和组合对象（部门）的处理逻辑（递归遍历）。”</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>好了，今天的内容到此就讲完了。我们一块来总结回顾一下，你需要重点掌握的内容。</p><p>组合模式的设计思路，与其说是一种设计模式，倒不如说是对业务场景的一种数据结构和算法的抽象。其中，数据可以表示成树这种数据结构，业务需求可以通过在树上的递归遍历算法来实现。</p><p>组合模式，将一组对象组织成树形结构，将单个对象和组合对象都看做树中的节点，以统一处理逻辑，并且它利用树形结构的特点，递归地处理每个子树，依次简化代码实现。使用组合模式的前提在于，你的业务场景必须能够表示成树形结构。所以，组合模式的应用场景也比较局限，它并不是一种很常用的设计模式。</p><h2 id="课堂讨论" tabindex="-1"><a class="header-anchor" href="#课堂讨论"><span>课堂讨论</span></a></h2><p>在文件系统那个例子中，countNumOfFiles()和countSizeOfFiles()这两个函数实现的效率并不高，因为每次调用它们的时候，都要重新遍历一遍子树。有没有什么办法可以提高这两个函数的执行效率呢（注意：文件系统还会涉及频繁的删除、添加文件操作，也就是对应Directory类中的addSubNode()和removeSubNode()函数）？</p><p>欢迎留言和我分享你的想法。如果有收获，也欢迎你把这篇文章分享给你的朋友。</p>`,41)]))}const v=n(l,[["render",p]]),t=JSON.parse('{"path":"/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E7%BB%93%E6%9E%84%E5%9E%8B/53%20_%20%E7%BB%84%E5%90%88%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%A6%82%E4%BD%95%E8%AE%BE%E8%AE%A1%E5%AE%9E%E7%8E%B0%E6%94%AF%E6%8C%81%E9%80%92%E5%BD%92%E9%81%8D%E5%8E%86%E7%9A%84%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E7%9B%AE%E5%BD%95%E6%A0%91%E7%BB%93%E6%9E%84%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"结构型设计模式就快要讲完了，还剩下两个不那么常用的：组合模式和享元模式。今天，我们来讲一下组合模式（Composite Design Pattern）。 组合模式跟我们之前讲的面向对象设计中的“组合关系（通过组合来组装两个类）”，完全是两码事。这里讲的“组合模式”，主要是用来处理树形结构数据。这里的“数据”，你可以简单理解为一组对象集合，待会我们会详细...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B9%8B%E7%BE%8E/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E8%8C%83%E5%BC%8F%EF%BC%9A%E7%BB%93%E6%9E%84%E5%9E%8B/53%20_%20%E7%BB%84%E5%90%88%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%A6%82%E4%BD%95%E8%AE%BE%E8%AE%A1%E5%AE%9E%E7%8E%B0%E6%94%AF%E6%8C%81%E9%80%92%E5%BD%92%E9%81%8D%E5%8E%86%E7%9A%84%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E7%9B%AE%E5%BD%95%E6%A0%91%E7%BB%93%E6%9E%84%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"结构型设计模式就快要讲完了，还剩下两个不那么常用的：组合模式和享元模式。今天，我们来讲一下组合模式（Composite Design Pattern）。 组合模式跟我们之前讲的面向对象设计中的“组合关系（通过组合来组装两个类）”，完全是两码事。这里讲的“组合模式”，主要是用来处理树形结构数据。这里的“数据”，你可以简单理解为一组对象集合，待会我们会详细..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":8.77,"words":2632},"filePathRelative":"posts/设计模式之美/设计模式与范式：结构型/53 _ 组合模式：如何设计实现支持递归遍历的文件系统目录树结构？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"53 | 组合模式：如何设计实现支持递归遍历的文件系统目录树结构？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/b3/fe/b337355b2a4c41b4a35a477acd369dfe.mp3\\"></audio></p>\\n<p>结构型设计模式就快要讲完了，还剩下两个不那么常用的：组合模式和享元模式。今天，我们来讲一下<strong>组合模式</strong>（Composite Design Pattern）。</p>","autoDesc":true}');export{v as comp,t as data};
