import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-CrA-f6So.js";const p={};function l(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="小实验-理解编译原理-一个四则运算的解释器" tabindex="-1"><a class="header-anchor" href="#小实验-理解编译原理-一个四则运算的解释器"><span>（小实验）理解编译原理：一个四则运算的解释器</span></a></h1><p><audio id="audio" title="（小实验）理解编译原理：一个四则运算的解释器" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/1a/fe/1aec47c521826e8bb2fbec95d5b15cfe.mp3"></audio></p><p>你好，我是winter。</p><p>在前面的课程中，我在JavaScript和CSS的部分，多次提到了编译原理相关的知识。这一部分的知识，如果我们从编译原理“龙书”等正规的资料中学习，就会耗费掉不少的时间，所以我在这里设计了一个小实验，帮助你快速理解编译原理相关的知识。</p><p>今天的内容比较特殊，我们来做一段详细的代码实验，详细的代码我放在了文章里，如果你正在收听音频，可以点击文章查看详情。</p><h2 id="分析" tabindex="-1"><a class="header-anchor" href="#分析"><span>分析</span></a></h2><p>按照编译原理相关的知识，我们来设计一下工作，这里我们分成几个步骤。</p><ul><li>定义四则运算：产出四则运算的词法定义和语法定义。</li><li>词法分析：把输入的字符串流变成token。</li><li>语法分析：把token变成抽象语法树AST。</li><li>解释执行：后序遍历AST，执行得出结果。</li></ul><h2 id="定义四则运算" tabindex="-1"><a class="header-anchor" href="#定义四则运算"><span>定义四则运算</span></a></h2><p>四则运算就是加减乘除四种运算，例如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1 + 2 * 3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>首先我们来定义词法，四则运算里面只有数字和运算符，所以定义很简单，但是我们还要注意空格和换行符，所以词法定义大概是下面这样的。</p><ul><li>Token</li><li>Number: <code>1</code> <code>2</code> <code>3</code> <code>4</code> <code>5</code> <code>6</code> <code>7</code> <code>8</code> <code>9</code> <code>0</code> 的组合</li><li>Operator: <code>+</code> 、<code>-</code>、 <code>*</code>、 <code>/</code> 之一</li></ul><p>这里我们对空白和换行符没有任何的处理，所以词法分析阶段会直接丢弃。</p><p>接下来我们来定义语法，语法定义多数采用BNF，但是其实大家写起来都是乱写的，比如JavaScript标准里面就是一种跟BNF类似的自创语法。</p><p>不过语法定义的核心思想不会变，都是几种结构的组合产生一个新的结构，所以语法定义也叫语法产生式。</p><p>因为加减乘除有优先级，所以我们可以认为加法是由若干个乘法再由加号或者减号连接成的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;Expression&amp;gt; ::= </span></span>
<span class="line"><span>    &amp;lt;AdditiveExpression&amp;gt;&amp;lt;EOF&amp;gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&amp;lt;AdditiveExpression&amp;gt; ::= </span></span>
<span class="line"><span>    &amp;lt;MultiplicativeExpression&amp;gt;</span></span>
<span class="line"><span>    |&amp;lt;AdditiveExpression&amp;gt;&amp;lt;+&amp;gt;&amp;lt;MultiplicativeExpression&amp;gt;</span></span>
<span class="line"><span>    |&amp;lt;AdditiveExpression&amp;gt;&amp;lt;-&amp;gt;&amp;lt;MultiplicativeExpression&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种BNF的写法类似递归的原理，你可以理解一下，它表示一个列表。为了方便，我们把普通数字也得当成乘法的一种特例了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;MultiplicativeExpression&amp;gt; ::= </span></span>
<span class="line"><span>    &amp;lt;Number&amp;gt;</span></span>
<span class="line"><span>    |&amp;lt;MultiplicativeExpression&amp;gt;&amp;lt;*&amp;gt;&amp;lt;Number&amp;gt;</span></span>
<span class="line"><span>    |&amp;lt;MultiplicativeExpression&amp;gt;&amp;lt;/&amp;gt;&amp;lt;Number&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>好了，这就是四则运算的定义了。</p><h2 id="词法分析-状态机" tabindex="-1"><a class="header-anchor" href="#词法分析-状态机"><span>词法分析：状态机</span></a></h2><p>词法分析部分，我们把字符流变成token流。词法分析有两种方案，一种是状态机，一种是正则表达式，它们是等效的，选择你喜欢的就好，这里我都会你介绍一下状态机。</p><p>根据分析，我们可能产生四种输入元素，其中只有两种token，我们状态机的第一个状态就是根据第一个输入字符来判断进入了哪种状态：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>var token = [];</span></span>
<span class="line"><span>const start = char =&amp;gt; {</span></span>
<span class="line"><span>    if(char === &#39;1&#39; </span></span>
<span class="line"><span>        || char === &#39;2&#39;</span></span>
<span class="line"><span>        || char === &#39;3&#39;</span></span>
<span class="line"><span>        || char === &#39;4&#39;</span></span>
<span class="line"><span>        || char === &#39;5&#39;</span></span>
<span class="line"><span>        || char === &#39;6&#39;</span></span>
<span class="line"><span>        || char === &#39;7&#39;</span></span>
<span class="line"><span>        || char === &#39;8&#39;</span></span>
<span class="line"><span>        || char === &#39;9&#39;</span></span>
<span class="line"><span>        || char === &#39;0&#39;</span></span>
<span class="line"><span>    ) {</span></span>
<span class="line"><span>        token.push(char);</span></span>
<span class="line"><span>        return inNumber;   </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(char === &#39;+&#39; </span></span>
<span class="line"><span>        || char === &#39;-&#39;</span></span>
<span class="line"><span>        || char === &#39;*&#39;</span></span>
<span class="line"><span>        || char === &#39;/&#39;</span></span>
<span class="line"><span>    ) {</span></span>
<span class="line"><span>        emmitToken(char, char);</span></span>
<span class="line"><span>        return start</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(char === &#39; &#39;) {</span></span>
<span class="line"><span>        return start;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(char === &#39;\\r&#39; </span></span>
<span class="line"><span>        || char === &#39;\\n&#39;</span></span>
<span class="line"><span>    ) {</span></span>
<span class="line"><span>        return start;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const inNumber = char =&amp;gt; {</span></span>
<span class="line"><span>    if(char === &#39;1&#39; </span></span>
<span class="line"><span>        || char === &#39;2&#39;</span></span>
<span class="line"><span>        || char === &#39;3&#39;</span></span>
<span class="line"><span>        || char === &#39;4&#39;</span></span>
<span class="line"><span>        || char === &#39;5&#39;</span></span>
<span class="line"><span>        || char === &#39;6&#39;</span></span>
<span class="line"><span>        || char === &#39;7&#39;</span></span>
<span class="line"><span>        || char === &#39;8&#39;</span></span>
<span class="line"><span>        || char === &#39;9&#39;</span></span>
<span class="line"><span>        || char === &#39;0&#39;</span></span>
<span class="line"><span>    ) {</span></span>
<span class="line"><span>        token.push(char);</span></span>
<span class="line"><span>        return inNumber;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        emmitToken(&quot;Number&quot;, token.join(&quot;&quot;));</span></span>
<span class="line"><span>        token = [];</span></span>
<span class="line"><span>        return start(char); // put back char</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个状态机非常简单，它只有两个状态，因为我们只有Number不是单字符的token。</p><p>这里我的状态机实现是非常经典的方式：用函数表示状态，用if表示状态的迁移关系，用return值表示下一个状态。</p><p>下面我们来运行一下这个状态机试试看：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>function emmitToken(type, value) {</span></span>
<span class="line"><span>    console.log(value);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var input = &quot;1024 + 2 * 256&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var state = start;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for(var c of input.split(&#39;&#39;))</span></span>
<span class="line"><span>    state = state(c);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state(Symbol(&#39;EOF&#39;))</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行后我们发现输出如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1024</span></span>
<span class="line"><span>+</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>*</span></span>
<span class="line"><span>256</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是我们想要的答案。</p><h2 id="语法分析-ll" tabindex="-1"><a class="header-anchor" href="#语法分析-ll"><span>语法分析：LL</span></a></h2><p>做完了词法分析，我们开始进行语法分析，LL语法分析根据每一个产生式来写一个函数，首先我们来写好函数名：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function AdditiveExpression( ){</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function MultiplicativeExpression(){</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了便于理解，我们就不做流式处理了，实际上一般编译代码都应该支持流式处理。</p><p>所以我们假设token已经都拿到了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>var tokens = [{</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;1024&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;+&quot;</span></span>
<span class="line"><span>    value: &quot;+&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;2&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;*&quot;</span></span>
<span class="line"><span>    value: &quot;*&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;256&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;EOF&quot;</span></span>
<span class="line"><span>}];</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个产生式对应着一个函数，例如：根据产生式，我们的AdditiveExpression需要处理三种情况：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;AdditiveExpression&amp;gt; ::= </span></span>
<span class="line"><span>    &amp;lt;MultiplicativeExpression&amp;gt;</span></span>
<span class="line"><span>    |&amp;lt;AdditiveExpression&amp;gt;&amp;lt;+&amp;gt;&amp;lt;MultiplicativeExpression&amp;gt;</span></span>
<span class="line"><span>    |&amp;lt;AdditiveExpression&amp;gt;&amp;lt;-&amp;gt;&amp;lt;MultiplicativeExpression&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么AddititveExpression中就要写三个if分支，来处理三种情况。</p><p>AdditiveExpression的写法是根传入的节点，利用产生式合成新的节点</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function AdditiveExpression(source){</span></span>
<span class="line"><span>    if(source[0].type === &quot;MultiplicativeExpression&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;AdditiveExpression&quot;,</span></span>
<span class="line"><span>            children:[source[0]]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        source[0] = node;</span></span>
<span class="line"><span>        return node;</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    if(source[0].type === &quot;AdditiveExpression&quot; &amp;amp;&amp;amp; source[1].type === &quot;+&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;AdditiveExpression&quot;,</span></span>
<span class="line"><span>            operator:&quot;+&quot;,</span></span>
<span class="line"><span>            children:[source.shift(), source.shift(), MultiplicativeExpression(source)]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(source[0].type === &quot;AdditiveExpression&quot; &amp;amp;&amp;amp; source[1].type === &quot;-&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;AdditiveExpression&quot;,</span></span>
<span class="line"><span>            operator:&quot;-&quot;,</span></span>
<span class="line"><span>            children:[source.shift(), source.shift(), MultiplicativeExpression(source)]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么下一步我们就把解析好的token传给我们的顶层处理函数Expression。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Expression(tokens);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>接下来，我们看Expression该怎么处理它。</p><p>我们Expression收到第一个token，是个Number，这个时候，Expression就傻了，这是因为产生式只告诉我们，收到了 AdditiveExpression 怎么办。</p><p>这个时候，我们就需要对产生式的首项层层展开，根据所有可能性调用相应的处理函数，这个过程在编译原理中称为求“closure”。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function Expression(source){</span></span>
<span class="line"><span>    if(source[0].type === &quot;AdditiveExpression&quot; &amp;amp;&amp;amp; source[1] &amp;amp;&amp;amp; source[1].type === &quot;EOF&quot; ) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;Expression&quot;,</span></span>
<span class="line"><span>            children:[source.shift(), source.shift()]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>        return node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AdditiveExpression(source);</span></span>
<span class="line"><span>    return Expression(source);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function AdditiveExpression(source){</span></span>
<span class="line"><span>    if(source[0].type === &quot;MultiplicativeExpression&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;AdditiveExpression&quot;,</span></span>
<span class="line"><span>            children:[source[0]]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        source[0] = node;</span></span>
<span class="line"><span>        return AdditiveExpression(source);</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    if(source[0].type === &quot;AdditiveExpression&quot; &amp;amp;&amp;amp; source[1] &amp;amp;&amp;amp; source[1].type === &quot;+&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;AdditiveExpression&quot;,</span></span>
<span class="line"><span>            operator:&quot;+&quot;,</span></span>
<span class="line"><span>            children:[]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        MultiplicativeExpression(source);</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>        return AdditiveExpression(source);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(source[0].type === &quot;AdditiveExpression&quot; &amp;amp;&amp;amp; source[1] &amp;amp;&amp;amp; source[1].type === &quot;-&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;AdditiveExpression&quot;,</span></span>
<span class="line"><span>            operator:&quot;-&quot;,</span></span>
<span class="line"><span>            children:[]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        MultiplicativeExpression(source);</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>        return AdditiveExpression(source);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(source[0].type === &quot;AdditiveExpression&quot;)</span></span>
<span class="line"><span>        return source[0];</span></span>
<span class="line"><span>    MultiplicativeExpression(source);</span></span>
<span class="line"><span>    return AdditiveExpression(source);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function MultiplicativeExpression(source){</span></span>
<span class="line"><span>    if(source[0].type === &quot;Number&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;MultiplicativeExpression&quot;,</span></span>
<span class="line"><span>            children:[source[0]]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        source[0] = node;</span></span>
<span class="line"><span>        return MultiplicativeExpression(source);</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    if(source[0].type === &quot;MultiplicativeExpression&quot; &amp;amp;&amp;amp; source[1] &amp;amp;&amp;amp; source[1].type === &quot;*&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;MultiplicativeExpression&quot;,</span></span>
<span class="line"><span>            operator:&quot;*&quot;,</span></span>
<span class="line"><span>            children:[]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>        return MultiplicativeExpression(source);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(source[0].type === &quot;MultiplicativeExpression&quot;&amp;amp;&amp;amp; source[1] &amp;amp;&amp;amp; source[1].type === &quot;/&quot;) {</span></span>
<span class="line"><span>        let node = {</span></span>
<span class="line"><span>            type:&quot;MultiplicativeExpression&quot;,</span></span>
<span class="line"><span>            operator:&quot;/&quot;,</span></span>
<span class="line"><span>            children:[]</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        node.children.push(source.shift());</span></span>
<span class="line"><span>        source.unshift(node);</span></span>
<span class="line"><span>        return MultiplicativeExpression(source);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(source[0].type === &quot;MultiplicativeExpression&quot;)</span></span>
<span class="line"><span>        return source[0];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return MultiplicativeExpression(source);</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>var source = [{</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;3&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;*&quot;,</span></span>
<span class="line"><span>    value: &quot;*&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;300&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;+&quot;,</span></span>
<span class="line"><span>    value: &quot;+&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;2&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;*&quot;,</span></span>
<span class="line"><span>    value: &quot;*&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;Number&quot;,</span></span>
<span class="line"><span>    value: &quot;256&quot;</span></span>
<span class="line"><span>}, {</span></span>
<span class="line"><span>    type:&quot;EOF&quot;</span></span>
<span class="line"><span>}];</span></span>
<span class="line"><span>var ast = Expression(source);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(ast);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解释执行" tabindex="-1"><a class="header-anchor" href="#解释执行"><span>解释执行</span></a></h2><p>得到了AST之后，最困难的一步我们已经解决了。这里我们就不对这颗树做任何的优化和精简了，那么接下来，直接进入执行阶段。我们只需要对这个树做遍历操作执行即可。</p><p>我们根据不同的节点类型和其它信息，写if分别处理即可：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>function evaluate(node) {</span></span>
<span class="line"><span>    if(node.type === &quot;Expression&quot;) {</span></span>
<span class="line"><span>        return evaluate(node.children[0])</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(node.type === &quot;AdditiveExpression&quot;) {</span></span>
<span class="line"><span>        if(node.operator === &#39;-&#39;) {</span></span>
<span class="line"><span>            return evaluate(node.children[0]) - evaluate(node.children[2]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if(node.operator === &#39;+&#39;) {</span></span>
<span class="line"><span>            return evaluate(node.children[0]) + evaluate(node.children[2]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return evaluate(node.children[0])</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(node.type === &quot;MultiplicativeExpression&quot;) {</span></span>
<span class="line"><span>        if(node.operator === &#39;*&#39;) {</span></span>
<span class="line"><span>            return evaluate(node.children[0]) * evaluate(node.children[2]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if(node.operator === &#39;/&#39;) {</span></span>
<span class="line"><span>            return evaluate(node.children[0]) / evaluate(node.children[2]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return evaluate(node.children[0])</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if(node.type === &quot;Number&quot;) {</span></span>
<span class="line"><span>        return Number(node.value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>在这个小实验中，我们通过一个小实验学习了编译原理的基本知识，小实验的目的是帮助你理解JavaScript课程中涉及到的编译原理基本概念，它离真正的编译原理学习还有很大的差距。</p><p>通过实验，我们了解了产生式、词法分析、语法分析和解释执行的过程。</p><p>最后留给你一些挑战，你可以根据自己的水平选择：</p><ul><li>补全emmitToken，使得我们的代码能完整工作起来。</li><li>为四则运算加入小数。</li><li>引入负数。</li><li>添加括号功能。</li></ul><p>欢迎写好的同学留言给我。</p>`,59)]))}const t=n(p,[["render",l]]),u=JSON.parse('{"path":"/posts/%E9%87%8D%E5%AD%A6%E5%89%8D%E7%AB%AF/%E6%A8%A1%E5%9D%97%E4%B8%80%EF%BC%9AJavaScript/%EF%BC%88%E5%B0%8F%E5%AE%9E%E9%AA%8C%EF%BC%89%E7%90%86%E8%A7%A3%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%EF%BC%9A%E4%B8%80%E4%B8%AA%E5%9B%9B%E5%88%99%E8%BF%90%E7%AE%97%E7%9A%84%E8%A7%A3%E9%87%8A%E5%99%A8.html","title":"（小实验）理解编译原理：一个四则运算的解释器","lang":"zh-CN","frontmatter":{"description":"（小实验）理解编译原理：一个四则运算的解释器 你好，我是winter。 在前面的课程中，我在JavaScript和CSS的部分，多次提到了编译原理相关的知识。这一部分的知识，如果我们从编译原理“龙书”等正规的资料中学习，就会耗费掉不少的时间，所以我在这里设计了一个小实验，帮助你快速理解编译原理相关的知识。 今天的内容比较特殊，我们来做一段详细的代码实验...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E9%87%8D%E5%AD%A6%E5%89%8D%E7%AB%AF/%E6%A8%A1%E5%9D%97%E4%B8%80%EF%BC%9AJavaScript/%EF%BC%88%E5%B0%8F%E5%AE%9E%E9%AA%8C%EF%BC%89%E7%90%86%E8%A7%A3%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86%EF%BC%9A%E4%B8%80%E4%B8%AA%E5%9B%9B%E5%88%99%E8%BF%90%E7%AE%97%E7%9A%84%E8%A7%A3%E9%87%8A%E5%99%A8.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"（小实验）理解编译原理：一个四则运算的解释器"}],["meta",{"property":"og:description","content":"（小实验）理解编译原理：一个四则运算的解释器 你好，我是winter。 在前面的课程中，我在JavaScript和CSS的部分，多次提到了编译原理相关的知识。这一部分的知识，如果我们从编译原理“龙书”等正规的资料中学习，就会耗费掉不少的时间，所以我在这里设计了一个小实验，帮助你快速理解编译原理相关的知识。 今天的内容比较特殊，我们来做一段详细的代码实验..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"（小实验）理解编译原理：一个四则运算的解释器\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":6.87,"words":2062},"filePathRelative":"posts/重学前端/模块一：JavaScript/（小实验）理解编译原理：一个四则运算的解释器.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"（小实验）理解编译原理：一个四则运算的解释器\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/1a/fe/1aec47c521826e8bb2fbec95d5b15cfe.mp3\\"></audio></p>\\n<p>你好，我是winter。</p>\\n<p>在前面的课程中，我在JavaScript和CSS的部分，多次提到了编译原理相关的知识。这一部分的知识，如果我们从编译原理“龙书”等正规的资料中学习，就会耗费掉不少的时间，所以我在这里设计了一个小实验，帮助你快速理解编译原理相关的知识。</p>","autoDesc":true}');export{t as comp,u as data};
