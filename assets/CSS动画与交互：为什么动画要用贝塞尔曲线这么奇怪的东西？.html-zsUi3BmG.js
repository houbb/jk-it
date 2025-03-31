import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const p={};function l(t,n){return e(),a("div",null,n[0]||(n[0]=[i(`<p><audio id="audio" title="CSS动画与交互：为什么动画要用贝塞尔曲线这么奇怪的东西？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/e3/15/e3494e8a6911d81c2970dcabc4597e15.mp3"></audio></p><p>你好，我是winter，今天我们来学习一下CSS的动画和交互。</p><p>在CSS属性中，有这么一类属性，它负责的不是静态的展现，而是根据用户行为产生交互。这就是今天我们要讲的属性。</p><p>首先我们先从属性来讲起。CSS中跟动画相关的属性有两个：animation和transition。</p><h2 id="animation属性和transition属性" tabindex="-1"><a class="header-anchor" href="#animation属性和transition属性"><span>animation属性和transition属性</span></a></h2><p>我们先来看下animation的示例，通过示例来了解一下animation属性的基本用法:</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@keyframes mykf</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  from {background: red;}</span></span>
<span class="line"><span>  to {background: yellow;}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>div</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    animation:mykf 5s infinite;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里展示了animation的基本用法，实际上animation分成六个部分：</p><ul><li>animation-name 动画的名称，这是一个keyframes类型的值（我们在第9讲“CSS语法：除了属性和选择器，你还需要知道这些带@的规则”讲到过，keyframes产生一种数据，用于定义动画关键帧）；</li><li>animation-duration 动画的时长；</li><li>animation-timing-function 动画的时间曲线；</li><li>animation-delay 动画开始前的延迟；</li><li>animation-iteration-count 动画的播放次数；</li><li>animation-direction 动画的方向。</li></ul><p>我们先来看 <code>animation-name</code>，这个是一个keyframes类型，需要配合@规则来使用。</p><p>比如，我们前面的示例中，就必须配合定义 mymove 这个 keyframes。keyframes的主体结构是一个名称和花括号中的定义，它按照百分比来规定数值，例如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@keyframes mykf {</span></span>
<span class="line"><span>  0% { top: 0; }</span></span>
<span class="line"><span>  50% { top: 30px; }</span></span>
<span class="line"><span>  75% { top: 10px; }</span></span>
<span class="line"><span>  100% { top: 0; }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们可以规定在开始时把top值设为0，在50%是设为30px，在75%时设为10px，到100%时重新设为0，这样，动画执行时就会按照我们指定的关键帧来变换数值。</p><p>这里，0%和100%可以写成from和to，不过一般不会混用，画风会变得很奇怪，比如：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@keyframes mykf {</span></span>
<span class="line"><span>  from { top: 0; }</span></span>
<span class="line"><span>  50% { top: 30px; }</span></span>
<span class="line"><span>  75% { top: 10px; }</span></span>
<span class="line"><span>  to { top: 0; }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里关键帧之间，是使用 <code>animation-timing-function</code> 作为时间曲线的，稍后我会详细介绍时间曲线。</p><p>接下来我们来介绍一下transition。transition与animation相比来说，是简单得多的一个属性。</p><p>它有四个部分：</p><ul><li>transition-property 要变换的属性；</li><li>transition-duration 变换的时长；</li><li>transition-timing-function 时间曲线；</li><li>transition-delay 延迟。</li></ul><p>这里的四个部分，可以重复多次，指定多个属性的变换规则。</p><p>实际上，有时候我们会把transition和animation组合，抛弃animation的timing-function，以编排不同段用不同的曲线。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@keyframes mykf {</span></span>
<span class="line"><span>  from { top: 0; transition:top ease}</span></span>
<span class="line"><span>  50% { top: 30px;transition:top ease-in }</span></span>
<span class="line"><span>  75% { top: 10px;transition:top ease-out }</span></span>
<span class="line"><span>  to { top: 0; transition:top linear}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个例子中，在keyframes中定义了transition属性，以达到各段曲线都不同的效果。</p><p>接下来，我们就来详细讲讲刚才提到的timing-function，动画的时间曲线。</p><h2 id="三次贝塞尔曲线" tabindex="-1"><a class="header-anchor" href="#三次贝塞尔曲线"><span>三次贝塞尔曲线</span></a></h2><p>我想，你能从很多CSS的资料中都找到了贝塞尔曲线，但是为什么CSS的时间曲线要选用（三次）贝塞尔曲线呢？</p><p>我们在这里首先要了解一下贝塞尔曲线，贝塞尔曲线是一种插值曲线，它描述了两个点之间差值来形成连续的曲线形状的规则。</p><p>一个量（可以是任何矢量或者标量）从一个值到变化到另一个值，如果我们希望它按照一定时间平滑地过渡，就必须要对它进行插值。</p><p>最基本的情况，我们认为这个变化是按照时间均匀进行的，这个时候，我们称其为线性插值。而实际上，线性插值不大能满足我们的需要，因此数学上出现了很多其它的插值算法，其中贝塞尔插值法是非常典型的一种。它根据一些变换中的控制点来决定值与时间的关系。</p><p>贝塞尔曲线是一种被工业生产验证了很多年的曲线，它最大的特点就是“平滑”。时间曲线平滑，意味着较少突兀的变化，这是一般动画设计所追求的。</p><p>贝塞尔曲线用于建筑设计和工业设计都有很多年历史了，它最初的应用是汽车工业用贝塞尔曲线来设计车型。</p><p>K次贝塞尔插值算法需要k+1个控制点，最简单的一次贝塞尔插值就是线性插值，将时间表示为0到1的区间，一次贝塞尔插值公式是：</p><img src="https://static001.geekbang.org/resource/image/d7/f8/d7e7c3bcc1e2b2ce72fde79956e872f8.png" alt=""><p>“二次贝塞尔插值”有3个控制点，相当于对P0和P1，P1和P2分别做贝塞尔插值，再对结果做一次贝塞尔插值计算</p><img src="https://static001.geekbang.org/resource/image/14/84/14d6a5396b7c0cc696c52a9e06e45184.png" alt=""><p>“三次贝塞尔插值”则是“两次‘二次贝塞尔插值’的结果，再做一次贝塞尔插值”：</p><img src="https://static001.geekbang.org/resource/image/65/b2/65ff1dd9b8e5911f9dd089531acea2b2.png" alt=""><p>贝塞尔曲线的定义中带有一个参数t，但是这个t并非真正的时间，实际上贝塞尔曲线的一个点(x, y)，这里的x轴才代表时间。</p><p>这就造成了一个问题，如果我们使用贝塞尔曲线的直接定义，是没办法直接根据时间来计算出数值的，因此，浏览器中一般都采用了数值算法，其中公认做有效的是牛顿积分，我们可以看下JavaScript版本的代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function generate(p1x, p1y, p2x, p2y) {</span></span>
<span class="line"><span>    const ZERO_LIMIT = 1e-6;</span></span>
<span class="line"><span>    // Calculate the polynomial coefficients,</span></span>
<span class="line"><span>    // implicit first and last control points are (0,0) and (1,1).</span></span>
<span class="line"><span>    const ax = 3 * p1x - 3 * p2x + 1;</span></span>
<span class="line"><span>    const bx = 3 * p2x - 6 * p1x;</span></span>
<span class="line"><span>    const cx = 3 * p1x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const ay = 3 * p1y - 3 * p2y + 1;</span></span>
<span class="line"><span>    const by = 3 * p2y - 6 * p1y;</span></span>
<span class="line"><span>    const cy = 3 * p1y;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    function sampleCurveDerivativeX(t) {</span></span>
<span class="line"><span>        // \`ax t^3 + bx t^2 + cx t&#39; expanded using Horner &#39;s rule.</span></span>
<span class="line"><span>        return (3 * ax * t + 2 * bx) * t + cx;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    function sampleCurveX(t) {</span></span>
<span class="line"><span>        return ((ax * t + bx) * t + cx ) * t;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    function sampleCurveY(t) {</span></span>
<span class="line"><span>        return ((ay * t + by) * t + cy ) * t;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Given an x value, find a parametric value it came from.</span></span>
<span class="line"><span>    function solveCurveX(x) {</span></span>
<span class="line"><span>        var t2 = x;</span></span>
<span class="line"><span>        var derivative;</span></span>
<span class="line"><span>        var x2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation</span></span>
<span class="line"><span>        // First try a few iterations of Newton&#39;s method -- normally very fast.</span></span>
<span class="line"><span>        // http://en.wikipedia.org/wiki/Newton&#39;s_method</span></span>
<span class="line"><span>        for (let i = 0; i &amp;lt; 8; i++) {</span></span>
<span class="line"><span>            // f(t)-x=0</span></span>
<span class="line"><span>            x2 = sampleCurveX(t2) - x;</span></span>
<span class="line"><span>            if (Math.abs(x2) &amp;lt; ZERO_LIMIT) {</span></span>
<span class="line"><span>                return t2;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            derivative = sampleCurveDerivativeX(t2);</span></span>
<span class="line"><span>            // == 0, failure</span></span>
<span class="line"><span>            /* istanbul ignore if */</span></span>
<span class="line"><span>            if (Math.abs(derivative) &amp;lt; ZERO_LIMIT) {</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            t2 -= x2 / derivative;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Fall back to the bisection method for reliability.</span></span>
<span class="line"><span>        // bisection</span></span>
<span class="line"><span>        // http://en.wikipedia.org/wiki/Bisection_method</span></span>
<span class="line"><span>        var t1 = 1;</span></span>
<span class="line"><span>        /* istanbul ignore next */</span></span>
<span class="line"><span>        var t0 = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* istanbul ignore next */</span></span>
<span class="line"><span>        t2 = x;</span></span>
<span class="line"><span>        /* istanbul ignore next */</span></span>
<span class="line"><span>        while (t1 &amp;gt; t0) {</span></span>
<span class="line"><span>            x2 = sampleCurveX(t2) - x;</span></span>
<span class="line"><span>            if (Math.abs(x2) &amp;lt; ZERO_LIMIT) {</span></span>
<span class="line"><span>                return t2;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (x2 &amp;gt; 0) {</span></span>
<span class="line"><span>                t1 = t2;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                t0 = t2;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            t2 = (t1 + t0) / 2;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Failure</span></span>
<span class="line"><span>        return t2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    function solve(x) {</span></span>
<span class="line"><span>        return sampleCurveY(solveCurveX(x));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return solve;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码其实完全翻译自WebKit的C++代码，牛顿积分的具体原理请参考相关数学著作，注释中也有相关的链接。</p><p>这个JavaScript版本的三次贝塞尔曲线可以用于实现跟CSS一模一样的动画。</p><h2 id="贝塞尔曲线拟合" tabindex="-1"><a class="header-anchor" href="#贝塞尔曲线拟合"><span>贝塞尔曲线拟合</span></a></h2><p>理论上，贝塞尔曲线可以通过分段的方式拟合任意曲线，但是有一些特殊的曲线，是可以用贝塞尔曲线完美拟合的，比如抛物线。</p><p>这里我做了一个示例，用于模拟抛物线：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;!DOCTYPE html&amp;gt;</span></span>
<span class="line"><span>&amp;lt;html&amp;gt;</span></span>
<span class="line"><span>&amp;lt;head&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;meta charset=&quot;utf-8&quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;title&amp;gt;Simulation&amp;lt;/title&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;style&amp;gt;</span></span>
<span class="line"><span>    .ball {</span></span>
<span class="line"><span>      width:10px;</span></span>
<span class="line"><span>      height:10px;</span></span>
<span class="line"><span>      background-color:black;</span></span>
<span class="line"><span>      border-radius:5px;</span></span>
<span class="line"><span>      position:absolute;</span></span>
<span class="line"><span>      left:0;</span></span>
<span class="line"><span>      top:0;</span></span>
<span class="line"><span>      transform:translateY(180px);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  &amp;lt;/style&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/head&amp;gt;</span></span>
<span class="line"><span>&amp;lt;body&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;label&amp;gt;运动时间：&amp;lt;input value=&quot;3.6&quot; type=&quot;number&quot; id=&quot;t&quot; /&amp;gt;s&amp;lt;/label&amp;gt;&amp;lt;br/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;label&amp;gt;初速度：&amp;lt;input value=&quot;-21&quot; type=&quot;number&quot; id=&quot;vy&quot; /&amp;gt; px/s&amp;lt;/label&amp;gt;&amp;lt;br/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;label&amp;gt;水平速度：&amp;lt;input value=&quot;21&quot; type=&quot;number&quot; id=&quot;vx&quot; /&amp;gt; px/s&amp;lt;/label&amp;gt;&amp;lt;br/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;label&amp;gt;重力：&amp;lt;input value=&quot;10&quot; type=&quot;number&quot; id=&quot;g&quot; /&amp;gt; px/s²&amp;lt;/label&amp;gt;&amp;lt;br/&amp;gt;</span></span>
<span class="line"><span>  &amp;lt;button onclick=&quot;createBall()&quot;&amp;gt;来一个球&amp;lt;/button&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/body&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/html&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>function generateCubicBezier (v, g, t){</span></span>
<span class="line"><span>    var a = v / g;</span></span>
<span class="line"><span>    var b = t + v / g;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return [[(a / 3 + (a + b) / 3 - a) / (b - a), (a * a / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)],</span></span>
<span class="line"><span>        [(b / 3 + (a + b) / 3 - a) / (b - a), (b * b / 3 + a * b * 2 / 3 - a * a) / (b * b - a * a)]];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function createBall() {</span></span>
<span class="line"><span>  var ball = document.createElement(&quot;div&quot;);</span></span>
<span class="line"><span>  var t = Number(document.getElementById(&quot;t&quot;).value);</span></span>
<span class="line"><span>  var vx = Number(document.getElementById(&quot;vx&quot;).value);</span></span>
<span class="line"><span>  var vy = Number(document.getElementById(&quot;vy&quot;).value);</span></span>
<span class="line"><span>  var g = Number(document.getElementById(&quot;g&quot;).value);</span></span>
<span class="line"><span>  ball.className = &quot;ball&quot;;</span></span>
<span class="line"><span>  document.body.appendChild(ball)</span></span>
<span class="line"><span>  ball.style.transition = \`left linear \${t}s, top cubic-bezier(\${generateCubicBezier(vy, g, t)}) \${t}s\`;</span></span>
<span class="line"><span>  setTimeout(function(){ </span></span>
<span class="line"><span>    ball.style.left = \`\${vx * t}px\`; </span></span>
<span class="line"><span>    ball.style.top = \`\${vy * t + 0.5 * g * t * t}px\`; </span></span>
<span class="line"><span>  }, 100);</span></span>
<span class="line"><span>  setTimeout(function(){ document.body.removeChild(ball); }, t * 1000);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码中，我实现了抛物线运动的小球，其中核心代码就是 generateCubicBezier 函数。</p><p>这个公式完全来自于一篇论文，推理过程我也不清楚，但是不论如何，它确实能够用于模拟抛物线。</p><p>实际上，我们日常工作中，如果需要用贝塞尔曲线拟合任何曲线，都可以找到相应的论文，我们只要取它的结论即可。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>我们今天的课程，重点介绍了动画和它背后的一些机制。</p><p>CSS用transition和animation两个属性来实现动画，这两个属性的基本用法很简单，我们今天还介绍了它们背后的原理：贝塞尔曲线。</p><p>我们中介绍了贝塞尔曲线的实现原理和贝塞尔曲线的拟合技巧。</p><p>最后，留给你一个小问题，请纯粹用JavaScript来实现一个transition函数，用它来跟CSS的transition来做一下对比，看看有哪些区别。</p>`,55)]))}const r=s(p,[["render",l]]),v=JSON.parse('{"path":"/posts/%E9%87%8D%E5%AD%A6%E5%89%8D%E7%AB%AF/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9AHTML%E5%92%8CCSS/CSS%E5%8A%A8%E7%94%BB%E4%B8%8E%E4%BA%A4%E4%BA%92%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E5%8A%A8%E7%94%BB%E8%A6%81%E7%94%A8%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF%E8%BF%99%E4%B9%88%E5%A5%87%E6%80%AA%E7%9A%84%E4%B8%9C%E8%A5%BF%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是winter，今天我们来学习一下CSS的动画和交互。 在CSS属性中，有这么一类属性，它负责的不是静态的展现，而是根据用户行为产生交互。这就是今天我们要讲的属性。 首先我们先从属性来讲起。CSS中跟动画相关的属性有两个：animation和transition。 animation属性和transition属性 我们先来看下animation...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/%E9%87%8D%E5%AD%A6%E5%89%8D%E7%AB%AF/%E6%A8%A1%E5%9D%97%E4%BA%8C%EF%BC%9AHTML%E5%92%8CCSS/CSS%E5%8A%A8%E7%94%BB%E4%B8%8E%E4%BA%A4%E4%BA%92%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E5%8A%A8%E7%94%BB%E8%A6%81%E7%94%A8%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF%E8%BF%99%E4%B9%88%E5%A5%87%E6%80%AA%E7%9A%84%E4%B8%9C%E8%A5%BF%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是winter，今天我们来学习一下CSS的动画和交互。 在CSS属性中，有这么一类属性，它负责的不是静态的展现，而是根据用户行为产生交互。这就是今天我们要讲的属性。 首先我们先从属性来讲起。CSS中跟动画相关的属性有两个：animation和transition。 animation属性和transition属性 我们先来看下animation..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":7.95,"words":2386},"filePathRelative":"posts/重学前端/模块二：HTML和CSS/CSS动画与交互：为什么动画要用贝塞尔曲线这么奇怪的东西？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"CSS动画与交互：为什么动画要用贝塞尔曲线这么奇怪的东西？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/e3/15/e3494e8a6911d81c2970dcabc4597e15.mp3\\"></audio></p>\\n<p>你好，我是winter，今天我们来学习一下CSS的动画和交互。</p>\\n<p>在CSS属性中，有这么一类属性，它负责的不是静态的展现，而是根据用户行为产生交互。这就是今天我们要讲的属性。</p>","autoDesc":true}');export{r as comp,v as data};
