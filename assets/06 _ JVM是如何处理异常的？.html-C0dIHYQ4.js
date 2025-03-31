import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(c,n){return e(),a("div",null,n[0]||(n[0]=[i(`<p><audio id="audio" title="06 | JVM是如何处理异常的？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/6d/d6/6d231cff0a16e93b6622a0a2cbc50bd6.mp3"></audio></p><p>你好，我是郑雨迪。今天我们来讲讲Java虚拟机的异常处理。</p><p>众所周知，异常处理的两大组成要素是抛出异常和捕获异常。这两大要素共同实现程序控制流的非正常转移。</p><p>抛出异常可分为显式和隐式两种。显式抛异常的主体是应用程序，它指的是在程序中使用“throw”关键字，手动将异常实例抛出。</p><p>隐式抛异常的主体则是Java虚拟机，它指的是Java虚拟机在执行过程中，碰到无法继续执行的异常状态，自动抛出异常。举例来说，Java虚拟机在执行读取数组操作时，发现输入的索引值是负数，故而抛出数组索引越界异常（ArrayIndexOutOfBoundsException）。</p><p>捕获异常则涉及了如下三种代码块。</p><li> try代码块：用来标记需要进行异常监控的代码。 </li><li> catch代码块：跟在try代码块之后，用来捕获在try代码块中触发的某种指定类型的异常。除了声明所捕获异常的类型之外，catch代码块还定义了针对该异常类型的异常处理器。在Java中，try代码块后面可以跟着多个catch代码块，来捕获不同类型的异常。Java虚拟机会从上至下匹配异常处理器。因此，前面的catch代码块所捕获的异常类型不能覆盖后边的，否则编译器会报错。 </li><li> finally代码块：跟在try代码块和catch代码块之后，用来声明一段必定运行的代码。它的设计初衷是为了避免跳过某些关键的清理代码，例如关闭已打开的系统资源。 </li><p>在程序正常执行的情况下，这段代码会在try代码块之后运行。否则，也就是try代码块触发异常的情况下，如果该异常没有被捕获，finally代码块会直接运行，并且在运行之后重新抛出该异常。</p><p>如果该异常被catch代码块捕获，finally代码块则在catch代码块之后运行。在某些不幸的情况下，catch代码块也触发了异常，那么finally代码块同样会运行，并会抛出catch代码块触发的异常。在某些极端不幸的情况下，finally代码块也触发了异常，那么只好中断当前finally代码块的执行，并往外抛异常。</p><p>上面这段听起来有点绕，但是等我讲完Java虚拟机的异常处理机制之后，你便会明白这其中的道理。</p><h2 id="异常的基本概念" tabindex="-1"><a class="header-anchor" href="#异常的基本概念"><span>异常的基本概念</span></a></h2><p>在Java语言规范中，所有异常都是Throwable类或者其子类的实例。Throwable有两大直接子类。第一个是Error，涵盖程序不应捕获的异常。当程序触发Error时，它的执行状态已经无法恢复，需要中止线程甚至是中止虚拟机。第二子类则是Exception，涵盖程序可能需要捕获并且处理的异常。</p><img src="https://static001.geekbang.org/resource/image/47/93/47c8429fc30aec201286b47f3c1a5993.png" alt=""><p>Exception有一个特殊的子类RuntimeException，用来表示“程序虽然无法继续执行，但是还能抢救一下”的情况。前边提到的数组索引越界便是其中的一种。</p><p>RuntimeException和Error属于Java里的非检查异常（unchecked exception）。其他异常则属于检查异常（checked exception）。在Java语法中，所有的检查异常都需要程序显式地捕获，或者在方法声明中用throws关键字标注。通常情况下，程序中自定义的异常应为检查异常，以便最大化利用Java编译器的编译时检查。</p><p>异常实例的构造十分昂贵。这是由于在构造异常实例时，Java虚拟机便需要生成该异常的栈轨迹（stack trace）。该操作会逐一访问当前线程的Java栈帧，并且记录下各种调试信息，包括栈帧所指向方法的名字，方法所在的类名、文件名，以及在代码中的第几行触发该异常。</p><p>当然，在生成栈轨迹时，Java虚拟机会忽略掉异常构造器以及填充栈帧的Java方法（Throwable.fillInStackTrace），直接从新建异常位置开始算起。此外，Java虚拟机还会忽略标记为不可见的Java方法栈帧。我们在介绍Lambda的时候会看到具体的例子。</p><p>既然异常实例的构造十分昂贵，我们是否可以缓存异常实例，在需要用到的时候直接抛出呢？从语法角度上来看，这是允许的。然而，该异常对应的栈轨迹并非throw语句的位置，而是新建异常的位置。</p><p>因此，这种做法可能会误导开发人员，使其定位到错误的位置。这也是为什么在实践中，我们往往选择抛出新建异常实例的原因。</p><h2 id="java虚拟机是如何捕获异常的" tabindex="-1"><a class="header-anchor" href="#java虚拟机是如何捕获异常的"><span>Java虚拟机是如何捕获异常的？</span></a></h2><p>在编译生成的字节码中，每个方法都附带一个异常表。异常表中的每一个条目代表一个异常处理器，并且由from指针、to指针、target指针以及所捕获的异常类型构成。这些指针的值是字节码索引（bytecode index，bci），用以定位字节码。</p><p>其中，from指针和to指针标示了该异常处理器所监控的范围，例如try代码块所覆盖的范围。target指针则指向异常处理器的起始位置，例如catch代码块的起始位置。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    mayThrowException();</span></span>
<span class="line"><span>  } catch (Exception e) {</span></span>
<span class="line"><span>    e.printStackTrace();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 对应的Java字节码</span></span>
<span class="line"><span>public static void main(java.lang.String[]);</span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    0: invokestatic mayThrowException:()V</span></span>
<span class="line"><span>    3: goto 11</span></span>
<span class="line"><span>    6: astore_1</span></span>
<span class="line"><span>    7: aload_1</span></span>
<span class="line"><span>    8: invokevirtual java.lang.Exception.printStackTrace</span></span>
<span class="line"><span>   11: return</span></span>
<span class="line"><span>  Exception table:</span></span>
<span class="line"><span>    from  to target type</span></span>
<span class="line"><span>      0   3   6  Class java/lang/Exception  // 异常表条目</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>举个例子，在上图的main方法中，我定义了一段try-catch代码。其中，catch代码块所捕获的异常类型为Exception。</p><p>编译过后，该方法的异常表拥有一个条目。其from指针和to指针分别为0和3，代表它的监控范围从索引为0的字节码开始，到索引为3的字节码结束（不包括3）。该条目的target指针是6，代表这个异常处理器从索引为6的字节码开始。条目的最后一列，代表该异常处理器所捕获的异常类型正是Exception。</p><p>当程序触发异常时，Java虚拟机会从上至下遍历异常表中的所有条目。当触发异常的字节码的索引值在某个异常表条目的监控范围内，Java虚拟机会判断所抛出的异常和该条目想要捕获的异常是否匹配。如果匹配，Java虚拟机会将控制流转移至该条目target指针指向的字节码。</p><p>如果遍历完所有异常表条目，Java虚拟机仍未匹配到异常处理器，那么它会弹出当前方法对应的Java栈帧，并且在调用者（caller）中重复上述操作。在最坏情况下，Java虚拟机需要遍历当前线程Java栈上所有方法的异常表。</p><p>finally代码块的编译比较复杂。当前版本Java编译器的做法，是复制finally代码块的内容，分别放在try-catch代码块所有正常执行路径以及异常执行路径的出口中。</p><img src="https://static001.geekbang.org/resource/image/17/06/17e2a3053b06b0a4383884f106e31c06.png" alt=""><p>针对异常执行路径，Java编译器会生成一个或多个异常表条目，监控整个try-catch代码块，并且捕获所有种类的异常（在javap中以any指代）。这些异常表条目的target指针将指向另一份复制的finally代码块。并且，在这个finally代码块的最后，Java编译器会重新抛出所捕获的异常。</p><p>如果你感兴趣的话，可以用javap工具来查看下面这段包含了try-catch-finally代码块的编译结果。为了更好地区分每个代码块，我定义了四个实例字段：tryBlock、catchBlock、finallyBlock、以及methodExit，并且仅在对应的代码块中访问这些字段。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Foo {</span></span>
<span class="line"><span>  private int tryBlock;</span></span>
<span class="line"><span>  private int catchBlock;</span></span>
<span class="line"><span>  private int finallyBlock;</span></span>
<span class="line"><span>  private int methodExit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void test() {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      tryBlock = 0;</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>      catchBlock = 1;</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      finallyBlock = 2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    methodExit = 3;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>$ javap -c Foo</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>  public void test();</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>       0: aload_0</span></span>
<span class="line"><span>       1: iconst_0</span></span>
<span class="line"><span>       2: putfield      #20                 // Field tryBlock:I</span></span>
<span class="line"><span>       5: goto          30</span></span>
<span class="line"><span>       8: astore_1</span></span>
<span class="line"><span>       9: aload_0</span></span>
<span class="line"><span>      10: iconst_1</span></span>
<span class="line"><span>      11: putfield      #22                 // Field catchBlock:I</span></span>
<span class="line"><span>      14: aload_0</span></span>
<span class="line"><span>      15: iconst_2</span></span>
<span class="line"><span>      16: putfield      #24                 // Field finallyBlock:I</span></span>
<span class="line"><span>      19: goto          35</span></span>
<span class="line"><span>      22: astore_2</span></span>
<span class="line"><span>      23: aload_0</span></span>
<span class="line"><span>      24: iconst_2</span></span>
<span class="line"><span>      25: putfield      #24                 // Field finallyBlock:I</span></span>
<span class="line"><span>      28: aload_2</span></span>
<span class="line"><span>      29: athrow</span></span>
<span class="line"><span>      30: aload_0</span></span>
<span class="line"><span>      31: iconst_2</span></span>
<span class="line"><span>      32: putfield      #24                 // Field finallyBlock:I</span></span>
<span class="line"><span>      35: aload_0</span></span>
<span class="line"><span>      36: iconst_3</span></span>
<span class="line"><span>      37: putfield      #26                 // Field methodExit:I</span></span>
<span class="line"><span>      40: return</span></span>
<span class="line"><span>    Exception table:</span></span>
<span class="line"><span>       from    to  target type</span></span>
<span class="line"><span>           0     5     8   Class java/lang/Exception</span></span>
<span class="line"><span>           0    14    22   any</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，编译结果包含三份finally代码块。其中，前两份分别位于try代码块和catch代码块的正常执行路径出口。最后一份则作为异常处理器，监控try代码块以及catch代码块。它将捕获try代码块触发的、未被catch代码块捕获的异常，以及catch代码块触发的异常。</p><p>这里有一个小问题，如果catch代码块捕获了异常，并且触发了另一个异常，那么finally捕获并且重抛的异常是哪个呢？答案是后者。也就是说原本的异常便会被忽略掉，这对于代码调试来说十分不利。</p><h2 id="java-7的suppressed异常以及语法糖" tabindex="-1"><a class="header-anchor" href="#java-7的suppressed异常以及语法糖"><span>Java 7的Suppressed异常以及语法糖</span></a></h2><p>Java 7引入了Suppressed异常来解决这个问题。这个新特性允许开发人员将一个异常附于另一个异常之上。因此，抛出的异常可以附带多个异常的信息。</p><p>然而，Java层面的finally代码块缺少指向所捕获异常的引用，所以这个新特性使用起来非常繁琐。</p><p>为此，Java 7专门构造了一个名为try-with-resources的语法糖，在字节码层面自动使用Suppressed异常。当然，该语法糖的主要目的并不是使用Suppressed异常，而是精简资源打开关闭的用法。</p><p>在Java 7之前，对于打开的资源，我们需要定义一个finally代码块，来确保该资源在正常或者异常执行状况下都能关闭。</p><p>资源的关闭操作本身容易触发异常。因此，如果同时打开多个资源，那么每一个资源都要对应一个独立的try-finally代码块，以保证每个资源都能够关闭。这样一来，代码将会变得十分繁琐。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>  FileInputStream in0 = null;</span></span>
<span class="line"><span>  FileInputStream in1 = null;</span></span>
<span class="line"><span>  FileInputStream in2 = null;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  try {</span></span>
<span class="line"><span>    in0 = new FileInputStream(new File(&amp;quot;in0.txt&amp;quot;));</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      in1 = new FileInputStream(new File(&amp;quot;in1.txt&amp;quot;));</span></span>
<span class="line"><span>      ...</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        in2 = new FileInputStream(new File(&amp;quot;in2.txt&amp;quot;));</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        if (in2 != null) in2.close();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>      if (in1 != null) in1.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } finally {</span></span>
<span class="line"><span>    if (in0 != null) in0.close();</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Java 7的try-with-resources语法糖，极大地简化了上述代码。程序可以在try关键字后声明并实例化实现了AutoCloseable接口的类，编译器将自动添加对应的close()操作。在声明多个AutoCloseable实例的情况下，编译生成的字节码类似于上面手工编写代码的编译结果。与手工代码相比，try-with-resources还会使用Suppressed异常的功能，来避免原异常“被消失”。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class Foo implements AutoCloseable {</span></span>
<span class="line"><span>  private final String name;</span></span>
<span class="line"><span>  public Foo(String name) { this.name = name; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  @Override</span></span>
<span class="line"><span>  public void close() {</span></span>
<span class="line"><span>    throw new RuntimeException(name);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public static void main(String[] args) {</span></span>
<span class="line"><span>    try (Foo foo0 = new Foo(&amp;quot;Foo0&amp;quot;); // try-with-resources</span></span>
<span class="line"><span>         Foo foo1 = new Foo(&amp;quot;Foo1&amp;quot;);</span></span>
<span class="line"><span>         Foo foo2 = new Foo(&amp;quot;Foo2&amp;quot;)) {</span></span>
<span class="line"><span>      throw new RuntimeException(&amp;quot;Initial&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 运行结果：</span></span>
<span class="line"><span>Exception in thread &amp;quot;main&amp;quot; java.lang.RuntimeException: Initial</span></span>
<span class="line"><span>        at Foo.main(Foo.java:18)</span></span>
<span class="line"><span>        Suppressed: java.lang.RuntimeException: Foo2</span></span>
<span class="line"><span>                at Foo.close(Foo.java:13)</span></span>
<span class="line"><span>                at Foo.main(Foo.java:19)</span></span>
<span class="line"><span>        Suppressed: java.lang.RuntimeException: Foo1</span></span>
<span class="line"><span>                at Foo.close(Foo.java:13)</span></span>
<span class="line"><span>                at Foo.main(Foo.java:19)</span></span>
<span class="line"><span>        Suppressed: java.lang.RuntimeException: Foo0</span></span>
<span class="line"><span>                at Foo.close(Foo.java:13)</span></span>
<span class="line"><span>                at Foo.main(Foo.java:19)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了try-with-resources语法糖之外，Java 7还支持在同一catch代码块中捕获多种异常。实际实现非常简单，生成多个异常表条目即可。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>// 在同一catch代码块中捕获多种异常</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>} catch (SomeException | OtherException e) {</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结与实践" tabindex="-1"><a class="header-anchor" href="#总结与实践"><span>总结与实践</span></a></h2><p>今天我介绍了Java虚拟机的异常处理机制。</p><p>Java的异常分为Exception和Error两种，而Exception又分为RuntimeException和其他类型。RuntimeException和Error属于非检查异常。其他的Exception皆属于检查异常，在触发时需要显式捕获，或者在方法头用throws关键字声明。</p><p>Java字节码中，每个方法对应一个异常表。当程序触发异常时，Java虚拟机将查找异常表，并依此决定需要将控制流转移至哪个异常处理器之中。Java代码中的catch代码块和finally代码块都会生成异常表条目。</p><p>Java 7引入了Suppressed异常、try-with-resources，以及多异常捕获。后两者属于语法糖，能够极大地精简我们的代码。</p><p>那么今天的实践环节，你可以看看其他控制流语句与finally代码块之间的协作。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>// 编译并用javap -c查看编译后的字节码</span></span>
<span class="line"><span>public class Foo {</span></span>
<span class="line"><span>  private int tryBlock;</span></span>
<span class="line"><span>  private int catchBlock;</span></span>
<span class="line"><span>  private int finallyBlock;</span></span>
<span class="line"><span>  private int methodExit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void test() {</span></span>
<span class="line"><span>    for (int i = 0; i &amp;lt; 100; i++) {</span></span>
<span class="line"><span>      try {</span></span>
<span class="line"><span>        tryBlock = 0;</span></span>
<span class="line"><span>        if (i &amp;lt; 50) {</span></span>
<span class="line"><span>          continue;</span></span>
<span class="line"><span>        } else if (i &amp;lt; 80) {</span></span>
<span class="line"><span>          break;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>      } catch (Exception e) {</span></span>
<span class="line"><span>        catchBlock = 1;</span></span>
<span class="line"><span>      } finally {</span></span>
<span class="line"><span>        finallyBlock = 2;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    methodExit = 3;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,54)]))}const r=s(l,[["render",p]]),v=JSON.parse('{"path":"/posts/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/%E6%A8%A1%E5%9D%97%E4%B8%80%EF%BC%9AJava%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%9F%BA%E6%9C%AC%E5%8E%9F%E7%90%86/06%20_%20JVM%E6%98%AF%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E5%BC%82%E5%B8%B8%E7%9A%84%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是郑雨迪。今天我们来讲讲Java虚拟机的异常处理。 众所周知，异常处理的两大组成要素是抛出异常和捕获异常。这两大要素共同实现程序控制流的非正常转移。 抛出异常可分为显式和隐式两种。显式抛异常的主体是应用程序，它指的是在程序中使用“throw”关键字，手动将异常实例抛出。 隐式抛异常的主体则是Java虚拟机，它指的是Java虚拟机在执行过程中，碰...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E6%B7%B1%E5%85%A5%E6%8B%86%E8%A7%A3Java%E8%99%9A%E6%8B%9F%E6%9C%BA/%E6%A8%A1%E5%9D%97%E4%B8%80%EF%BC%9AJava%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%9F%BA%E6%9C%AC%E5%8E%9F%E7%90%86/06%20_%20JVM%E6%98%AF%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E5%BC%82%E5%B8%B8%E7%9A%84%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是郑雨迪。今天我们来讲讲Java虚拟机的异常处理。 众所周知，异常处理的两大组成要素是抛出异常和捕获异常。这两大要素共同实现程序控制流的非正常转移。 抛出异常可分为显式和隐式两种。显式抛异常的主体是应用程序，它指的是在程序中使用“throw”关键字，手动将异常实例抛出。 隐式抛异常的主体则是Java虚拟机，它指的是Java虚拟机在执行过程中，碰..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":11.31,"words":3392},"filePathRelative":"posts/深入拆解Java虚拟机/模块一：Java虚拟机基本原理/06 _ JVM是如何处理异常的？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"06 | JVM是如何处理异常的？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/6d/d6/6d231cff0a16e93b6622a0a2cbc50bd6.mp3\\"></audio></p>\\n<p>你好，我是郑雨迪。今天我们来讲讲Java虚拟机的异常处理。</p>\\n<p>众所周知，异常处理的两大组成要素是抛出异常和捕获异常。这两大要素共同实现程序控制流的非正常转移。</p>\\n<p>抛出异常可分为显式和隐式两种。显式抛异常的主体是应用程序，它指的是在程序中使用“throw”关键字，手动将异常实例抛出。</p>","autoDesc":true}');export{r as comp,v as data};
