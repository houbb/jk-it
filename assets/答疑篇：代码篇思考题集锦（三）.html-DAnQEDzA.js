import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-6Bz2fGO5.js";const p={};function l(t,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p><audio id="audio" title="答疑篇：代码篇思考题集锦（三）" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/47/92/47d7c5a60208e19a8d718e56c11d7292.mp3"></audio></p><p>你好，我是朱晔。</p><p>今天，我们继续一起分析这门课第13~20讲的课后思考题。这些题目涉及了日志、文件IO、序列化、Java 8日期时间类、OOM、Java高级特性（反射、注解和泛型）和Spring框架的16道问题。</p><p>接下来，我们就一一具体分析吧。</p><h3 id="_13-日志-日志记录真没你想象的那么简单" tabindex="-1"><a class="header-anchor" href="#_13-日志-日志记录真没你想象的那么简单"><span><a href="https://time.geekbang.org/column/article/220307" target="_blank" rel="noopener noreferrer">13 | 日志：日志记录真没你想象的那么简单</a></span></a></h3><p>**问题1：**在讲“为什么我的日志会重复记录？”的案例时，我们把INFO级别的日志存放到_info.log中，把WARN和ERROR级别的日志存放到_error.log中。如果现在要把INFO和WARN级别的日志存放到_info.log中，把ERROR日志存放到_error.log中，应该如何配置Logback呢？</p><p>答：要实现这个配置有两种方式，分别是：直接使用EvaluatorFilter和自定义一个Filter。我们分别看一下。</p><p>第一种方式是，直接使用logback自带的EvaluatorFilter：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;filter class=&amp;quot;ch.qos.logback.core.filter.EvaluatorFilter&amp;quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;evaluator class=&amp;quot;ch.qos.logback.classic.boolex.GEventEvaluator&amp;quot;&amp;gt;</span></span>
<span class="line"><span>        &amp;lt;expression&amp;gt;</span></span>
<span class="line"><span>            e.level.toInt() == WARN.toInt() || e.level.toInt() == INFO.toInt()</span></span>
<span class="line"><span>        &amp;lt;/expression&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;/evaluator&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;OnMismatch&amp;gt;DENY&amp;lt;/OnMismatch&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;OnMatch&amp;gt;NEUTRAL&amp;lt;/OnMatch&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/filter&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种方式是，自定义一个Filter，实现解析配置中的“|”字符分割的多个Level：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class MultipleLevelsFilter extends Filter&amp;lt;ILoggingEvent&amp;gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    @Setter</span></span>
<span class="line"><span>    private String levels;</span></span>
<span class="line"><span>    private List&amp;lt;Integer&amp;gt; levelList;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public FilterReply decide(ILoggingEvent event) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (levelList == null &amp;amp;&amp;amp; !StringUtils.isEmpty(levels)) {</span></span>
<span class="line"><span>            //把由|分割的多个Level转换为List&amp;lt;Integer&amp;gt;</span></span>
<span class="line"><span>            levelList = Arrays.asList(levels.split(&amp;quot;\\\\|&amp;quot;)).stream()</span></span>
<span class="line"><span>                    .map(item -&amp;gt; Level.valueOf(item))</span></span>
<span class="line"><span>                    .map(level -&amp;gt; level.toInt())</span></span>
<span class="line"><span>                    .collect(Collectors.toList());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //如果levelList包含当前日志的级别，则接收否则拒绝</span></span>
<span class="line"><span>        if (levelList.contains(event.getLevel().toInt()))</span></span>
<span class="line"><span>            return FilterReply.ACCEPT;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            return FilterReply.DENY;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，在配置文件中使用这个MultipleLevelsFilter就可以了（完整的配置代码参考<a href="https://github.com/JosephZhu1983/java-common-mistakes/blob/master/src/main/java/org/geekbang/time/commonmistakes/logging/duplicate/multiplelevelsfilter.xml" target="_blank" rel="noopener noreferrer">这里</a>）：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;filter class=&amp;quot;org.geekbang.time.commonmistakes.logging.duplicate.MultipleLevelsFilter&amp;quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;levels&amp;gt;INFO|WARN&amp;lt;/levels&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/filter&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>**问题2：**生产级项目的文件日志肯定需要按时间和日期进行分割和归档处理，以避免单个文件太大，同时保留一定天数的历史日志，你知道如何配置吗？可以在<a href="http://logback.qos.ch/manual/appenders.html#RollingFileAppender" target="_blank" rel="noopener noreferrer">官方文档</a>找到答案。</p><p>答：参考配置如下，使用SizeAndTimeBasedRollingPolicy来实现按照文件大小和历史文件保留天数，进行文件分割和归档：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&amp;lt;rollingPolicy class=&amp;quot;ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy&amp;quot;&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;!--日志文件保留天数--&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;MaxHistory&amp;gt;30&amp;lt;/MaxHistory&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;!--日志文件最大的大小--&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;MaxFileSize&amp;gt;100MB&amp;lt;/MaxFileSize&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;!--日志整体最大</span></span>
<span class="line"><span>     可选的totalSizeCap属性控制所有归档文件的总大小。当超过总大小上限时，将异步删除最旧的存档。</span></span>
<span class="line"><span>     totalSizeCap属性也需要设置maxHistory属性。此外，“最大历史”限制总是首先应用，“总大小上限”限制其次应用。</span></span>
<span class="line"><span>     --&amp;gt;</span></span>
<span class="line"><span>    &amp;lt;totalSizeCap&amp;gt;10GB&amp;lt;/totalSizeCap&amp;gt;</span></span>
<span class="line"><span>&amp;lt;/rollingPolicy&amp;gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_14-文件io-实现高效正确的文件读写并非易事" tabindex="-1"><a class="header-anchor" href="#_14-文件io-实现高效正确的文件读写并非易事"><span><a href="https://time.geekbang.org/column/article/223051" target="_blank" rel="noopener noreferrer">14 | 文件IO：实现高效正确的文件读写并非易事</a></span></a></h3><p>**问题1：**Files.lines方法进行流式处理，需要使用try-with-resources进行资源释放。那么，使用Files类中其他返回Stream包装对象的方法进行流式处理，比如newDirectoryStream方法返回DirectoryStream<path>，list、walk和find方法返回Stream<path>，也同样有资源释放问题吗？</path></path></p><p>答：使用Files类中其他返回Stream包装对象的方法进行流式处理，也同样会有资源释放问题。</p><p>因为，这些接口都需要使用try-with-resources模式来释放。正如文中所说，如果不显式释放，那么可能因为底层资源没有及时关闭造成资源泄露。</p><p>**问题2：**Java的File类和Files类提供的文件复制、重命名、删除等操作，是原子性的吗？</p><p>答：Java的File和Files类的文件复制、重命名、删除等操作，都不是原子性的。原因是，文件类操作基本都是调用操作系统本身的API，一般来说这些文件API并不像数据库有事务机制（也很难办到），即使有也很可能有平台差异性。</p><p>比如，File.renameTo方法的文档中提到：</p><blockquote></blockquote><p>Many aspects of the behavior of this method are inherently platform-dependent: The rename operation might not be able to move a file from one filesystem to another, it might not be atomic, and it might not succeed if a file with the destination abstract pathname already exists. The return value should always be checked to make sure that the rename operation was successful.</p><p>又比如，Files.copy方法的文档中提到：</p><blockquote></blockquote><p>Copying a file is not an atomic operation. If an IOException is thrown, then it is possible that the target file is incomplete or some of its file attributes have not been copied from the source file. When the REPLACE_EXISTING option is specified and the target file exists, then the target file is replaced. The check for the existence of the file and the creation of the new file may not be atomic with respect to other file system activities.</p><h3 id="_15-序列化-一来一回你还是原来的你吗" tabindex="-1"><a class="header-anchor" href="#_15-序列化-一来一回你还是原来的你吗"><span><a href="https://time.geekbang.org/column/article/223111" target="_blank" rel="noopener noreferrer">15 | 序列化：一来一回你还是原来的你吗？</a></span></a></h3><p>**问题1：**在讨论Redis序列化方式的时候，我们自定义了RedisTemplate，让Key使用String序列化、让Value使用JSON序列化，从而使Redis获得的Value可以直接转换为需要的对象类型。那么，使用RedisTemplate&lt;String, Long&gt;能否存取Value是Long的数据呢？这其中有什么坑吗？</p><p>答：使用RedisTemplate&lt;String, Long&gt;，不一定能存取Value是Long的数据。在Integer区间内返回的是Integer，超过这个区间返回Long。测试代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@GetMapping(&amp;quot;wrong2&amp;quot;)</span></span>
<span class="line"><span>public void wrong2() {</span></span>
<span class="line"><span>    String key = &amp;quot;testCounter&amp;quot;;</span></span>
<span class="line"><span>    //测试一下设置在Integer范围内的值</span></span>
<span class="line"><span>    countRedisTemplate.opsForValue().set(key, 1L);</span></span>
<span class="line"><span>    log.info(&amp;quot;{} {}&amp;quot;, countRedisTemplate.opsForValue().get(key), countRedisTemplate.opsForValue().get(key) instanceof Long);</span></span>
<span class="line"><span>    Long l1 = getLongFromRedis(key);</span></span>
<span class="line"><span>    //测试一下设置超过Integer范围的值</span></span>
<span class="line"><span>    countRedisTemplate.opsForValue().set(key, Integer.MAX_VALUE + 1L);</span></span>
<span class="line"><span>    log.info(&amp;quot;{} {}&amp;quot;, countRedisTemplate.opsForValue().get(key), countRedisTemplate.opsForValue().get(key) instanceof Long);</span></span>
<span class="line"><span>    //使用getLongFromRedis转换后的值必定是Long</span></span>
<span class="line"><span>    Long l2 = getLongFromRedis(key);</span></span>
<span class="line"><span>    log.info(&amp;quot;{} {}&amp;quot;, l1, l2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Long getLongFromRedis(String key) {</span></span>
<span class="line"><span>    Object o = countRedisTemplate.opsForValue().get(key);</span></span>
<span class="line"><span>    if (o instanceof Integer) {</span></span>
<span class="line"><span>        return ((Integer) o).longValue();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (o instanceof Long) {</span></span>
<span class="line"><span>        return (Long) o;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会得到如下输出：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1 false</span></span>
<span class="line"><span>2147483648 true</span></span>
<span class="line"><span>1 2147483648</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，值设置1的时候类型不是Long，设置2147483648的时候是Long。也就是使用RedisTemplate&lt;String, Long&gt;不一定就代表获取的到的Value是Long。</p><p>所以，这边我写了一个getLongFromRedis方法来做转换避免出错，判断当值是Integer的时候转换为Long。</p><p>**问题2：**你可以看一下Jackson2ObjectMapperBuilder类源码的实现（注意configure方法），分析一下其除了关闭FAIL_ON_UNKNOWN_PROPERTIES外，还做了什么吗？</p><p>答：除了关闭FAIL_ON_UNKNOWN_PROPERTIES外，Jackson2ObjectMapperBuilder类源码还主要做了以下两方面的事儿。</p><p>第一，设置Jackson的一些默认值，比如：</p><ul><li>MapperFeature.DEFAULT_VIEW_INCLUSION设置为禁用；</li><li>DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES设置为禁用。</li></ul><p>第二，自动注册classpath中存在的一些jackson模块，比如：</p><ul><li>jackson-datatype-jdk8，支持JDK8的一些类型，比如Optional；</li><li>jackson-datatype-jsr310， 支持JDK8的日期时间一些类型。</li><li>jackson-datatype-joda，支持Joda-Time类型。</li><li>jackson-module-kotlin，支持Kotlin。</li></ul><h3 id="_16-用好java-8的日期时间类-少踩一些-老三样-的坑" tabindex="-1"><a class="header-anchor" href="#_16-用好java-8的日期时间类-少踩一些-老三样-的坑"><span><a href="https://time.geekbang.org/column/article/224240" target="_blank" rel="noopener noreferrer">16 | 用好Java 8的日期时间类，少踩一些“老三样”的坑</a></span></a></h3><p>**问题1：**在这一讲中，我多次强调了Date是一个时间戳，是UTC时间、没有时区概念。那，为什么调用其toString方法，会输出类似CST之类的时区字样呢？</p><p>答：关于这个问题，参考toString中的相关源码，你可以看到会获取当前时区（取不到则显示GMT）进行格式化：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public String toString() {</span></span>
<span class="line"><span>    BaseCalendar.Date date = normalize();</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    TimeZone zi = date.getZone();</span></span>
<span class="line"><span>    if (zi != null) {</span></span>
<span class="line"><span>        sb.append(zi.getDisplayName(date.isDaylightTime(), TimeZone.SHORT, Locale.US)); // zzz</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        sb.append(&amp;quot;GMT&amp;quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    sb.append(&#39; &#39;).append(date.getYear());  // yyyy</span></span>
<span class="line"><span>    return sb.toString();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private final BaseCalendar.Date normalize() {</span></span>
<span class="line"><span>    if (cdate == null) {</span></span>
<span class="line"><span>        BaseCalendar cal = getCalendarSystem(fastTime);</span></span>
<span class="line"><span>        cdate = (BaseCalendar.Date) cal.getCalendarDate(fastTime,</span></span>
<span class="line"><span>                                                        TimeZone.getDefaultRef());</span></span>
<span class="line"><span>        return cdate;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // Normalize cdate with the TimeZone in cdate first. This is</span></span>
<span class="line"><span>    // required for the compatible behavior.</span></span>
<span class="line"><span>    if (!cdate.isNormalized()) {</span></span>
<span class="line"><span>        cdate = normalize(cdate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // If the default TimeZone has changed, then recalculate the</span></span>
<span class="line"><span>    // fields with the new TimeZone.</span></span>
<span class="line"><span>    TimeZone tz = TimeZone.getDefaultRef();</span></span>
<span class="line"><span>    if (tz != cdate.getZone()) {</span></span>
<span class="line"><span>        cdate.setZone(tz);</span></span>
<span class="line"><span>        CalendarSystem cal = getCalendarSystem(cdate);</span></span>
<span class="line"><span>        cal.getCalendarDate(fastTime, cdate);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return cdate;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实说白了，这里显示的时区仅仅用于呈现，并不代表Date类内置了时区信息。</p><p>**问题2：**日期时间数据始终要保存到数据库中，MySQL中有两种数据类型datetime和timestamp可以用来保存日期时间。你能说说它们的区别吗，它们是否包含时区信息呢？</p><p>答：datetime和timestamp的区别，主要体现在占用空间、表示的时间范围和时区三个方面。</p><ul><li>占用空间：datetime占用8字节；timestamp占用4字节。</li><li>表示的时间范围：datetime表示的范围是从“1000-01-01 00:00:00.000000”到“9999-12-31 23:59:59.999999”；timestamp表示的范围是从“1970-01-01 00:00:01.000000”到“2038-01-19 03:14:07.999999”。</li><li>时区：timestamp保存的时候根据当前时区转换为UTC，查询的时候再根据当前时区从UTC转回来；而datetime就是一个死的字符串时间（仅仅对MySQL本身而言）表示。</li></ul><p>需要注意的是，我们说datetime不包含时区是固定的时间表示，仅仅是指MySQL本身。使用timestamp，需要考虑Java进程的时区和MySQL连接的时区。而使用datetime类型，则只需要考虑Java进程的时区（因为MySQL datetime没有时区信息了，JDBC时间戳转换成MySQL datetime，会根据MySQL的serverTimezone做一次转换）。</p><p>如果你的项目有国际化需求，我推荐使用时间戳，并且要确保你的应用服务器和数据库服务器设置了正确的匹配当地时区的时区配置。</p><p>其实，即便你的项目没有国际化需求，至少是应用服务器和数据库服务器设置一致的时区，也是需要的。</p><h3 id="_17-别以为-自动挡-就不可能出现oom" tabindex="-1"><a class="header-anchor" href="#_17-别以为-自动挡-就不可能出现oom"><span><a href="https://time.geekbang.org/column/article/224784" target="_blank" rel="noopener noreferrer">17 | 别以为“自动挡”就不可能出现OOM</a></span></a></h3><p>**问题1：**Spring的ConcurrentReferenceHashMap，针对Key和Value支持软引用和弱引用两种方式。你觉得哪种方式更适合做缓存呢？</p><p>答：软引用和弱引用的区别在于：若一个对象是弱引用可达，无论当前内存是否充足它都会被回收，而软引用可达的对象在内存不充足时才会被回收。因此，软引用要比弱引用“强”一些。</p><p>那么，使用弱引用作为缓存就会让缓存的生命周期过短，所以软引用更适合作为缓存。</p><p>**问题2：**当我们需要动态执行一些表达式时，可以使用Groovy动态语言实现：new出一个GroovyShell类，然后调用evaluate方法动态执行脚本。这种方式的问题是，会重复产生大量的类，增加Metaspace区的GC负担，有可能会引起OOM。你知道如何避免这个问题吗？</p><p>答：调用evaluate方法动态执行脚本会产生大量的类，要避免可能因此导致的OOM问题，我们可以把脚本包装为一个函数，先调用parse函数来得到Script对象，然后缓存起来，以后直接使用invokeMethod方法调用这个函数即可：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>private Object rightGroovy(String script, String method, Object... args) {</span></span>
<span class="line"><span>    Script scriptObject;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    if (SCRIPT_CACHE.containsKey(script)) {</span></span>
<span class="line"><span>        //如果脚本已经生成过Script则直接使用</span></span>
<span class="line"><span>        scriptObject = SCRIPT_CACHE.get(script);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        //否则把脚本解析为Script</span></span>
<span class="line"><span>        scriptObject = shell.parse(script);</span></span>
<span class="line"><span>        SCRIPT_CACHE.put(script, scriptObject);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return scriptObject.invokeMethod(method, args);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我在源码中提供了一个<a href="https://github.com/JosephZhu1983/java-common-mistakes/blob/master/src/main/java/org/geekbang/time/commonmistakes/oom/groovyoom/GroovyOOMController.java" target="_blank" rel="noopener noreferrer">测试程序</a>，你可以直接去看一下。</p><h3 id="_18-当反射、注解和泛型遇到oop时-会有哪些坑" tabindex="-1"><a class="header-anchor" href="#_18-当反射、注解和泛型遇到oop时-会有哪些坑"><span><a href="https://time.geekbang.org/column/article/225596" target="_blank" rel="noopener noreferrer">18 | 当反射、注解和泛型遇到OOP时，会有哪些坑？</a></span></a></h3><p>**问题1：**泛型类型擦除后会生成一个bridge方法，这个方法同时又是synthetic方法。除了泛型类型擦除，你知道还有什么情况编译器会生成synthetic方法吗？</p><p>答：Synthetic方法是编译器自动生成的方法（在源码中不出现）。除了文中提到的泛型类型擦除外，Synthetic方法还可能出现的一个比较常见的场景，是内部类和顶层类需要相互访问对方的private字段或方法的时候。</p><p>编译后的内部类和普通类没有区别，遵循private字段或方法对外部类不可见的原则，但语法上内部类和顶层类的私有字段需要可以相互访问。为了解决这个矛盾，编译器就只能生成桥接方法，也就是Synthetic方法，来把private成员转换为package级别的访问限制。</p><p>比如如下代码，InnerClassApplication类的test方法需要访问内部类MyInnerClass类的私有字段name，而内部类MyInnerClass类的test方法需要访问外部类InnerClassApplication类的私有字段gender。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public class InnerClassApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String gender = &amp;quot;male&amp;quot;;</span></span>
<span class="line"><span>    public static void main(String[] args) throws Exception {</span></span>
<span class="line"><span>        InnerClassApplication application = new InnerClassApplication();</span></span>
<span class="line"><span>        application.test();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void test(){</span></span>
<span class="line"><span>        MyInnerClass myInnerClass = new MyInnerClass();</span></span>
<span class="line"><span>        System.out.println(myInnerClass.name);</span></span>
<span class="line"><span>        myInnerClass.test();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    class MyInnerClass {</span></span>
<span class="line"><span>        private String name = &amp;quot;zhuye&amp;quot;;</span></span>
<span class="line"><span>        void test(){</span></span>
<span class="line"><span>            System.out.println(gender);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译器会为InnerClassApplication和MyInnerClass都生成桥接方法。</p><p>如下图所示，InnerClassApplication的test方法，其实调用的是内部类的access$000静态方法：</p><img src="https://static001.geekbang.org/resource/image/93/66/93a0fd1feb705be9fd63c3b963943c66.png" alt=""><p>这个access$000方法是Synthetic方法：</p><img src="https://static001.geekbang.org/resource/image/2a/f0/2aa967cfbd7832d0893605c4249363f0.png" alt=""><p>而Synthetic方法的实现转接调用了内部类的name字段：</p><img src="https://static001.geekbang.org/resource/image/06/3d/064809b7fba7dc34f5c955a1a7dbf33d.png" alt=""><p>反过来，内部类的test方法也是通过外部类InnerClassApplication类的桥接方法access$100调用到其私有字段：</p><img src="https://static001.geekbang.org/resource/image/eb/9e/ebefeeda2de626ca8cbdf5388763669e.png" alt=""><p>**问题2：**关于注解继承问题，你觉得Spring的常用注解@Service、@Controller是否支持继承呢？</p><p>答：Spring的常用注解@Service、@Controller，不支持继承。这些注解只支持放到具体的（非接口非抽象）顶层类上（来让它们成为Bean），如果支持继承会非常不灵活而且容易出错。</p><h3 id="_19-spring框架-ioc和aop是扩展的核心" tabindex="-1"><a class="header-anchor" href="#_19-spring框架-ioc和aop是扩展的核心"><span><a href="https://time.geekbang.org/column/article/227917" target="_blank" rel="noopener noreferrer">19 | Spring框架：IoC和AOP是扩展的核心</a></span></a></h3><p>**问题1：**除了通过@Autowired注入Bean外，还可以使用@Inject或@Resource来注入Bean。你知道这三种方式的区别是什么吗？</p><p>答：我们先说一下使用@Autowired、@Inject和@Resource这三种注解注入Bean的方式：</p><ul><li>@Autowired，是Spring的注解，优先按照类型注入。当无法确定具体注入类型的时候，可以通过@Qualifier注解指定Bean名称。</li><li>@Inject：是JSR330规范的实现，也是根据类型进行自动装配的，这一点和@Autowired类似。如果需要按名称进行装配，则需要配合使用@Named。@Autowired和@Inject的区别在于，前者可以使用required=false允许注入null，后者允许注入一个Provider实现延迟注入。</li><li>@Resource：JSR250规范的实现，如果不指定name优先根据名称进行匹配（然后才是类型），如果指定name则仅根据名称匹配。</li></ul><p>**问题2：**当Bean产生循环依赖时，比如BeanA的构造方法依赖BeanB作为成员需要注入，BeanB也依赖BeanA，你觉得会出现什么问题呢？又有哪些解决方式呢？</p><p>答：Bean产生循环依赖，主要包括两种情况：一种是注入属性或字段涉及循环依赖，另一种是构造方法注入涉及循环依赖。接下来，我分别和你讲一讲。</p><p>第一种，注入属性或字段涉及循环依赖，比如TestA和TestB相互依赖：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class TestA {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    private TestB testB;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class TestB {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    private TestA testA;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>针对这个问题，Spring内部通过三个Map的方式解决了这个问题，不会出错。基本原理是，因为循环依赖，所以实例的初始化无法一次到位，需要分步进行：</p><ol><li>创建A（仅仅实例化，不注入依赖）；</li><li>创建B（仅仅实例化，不注入依赖）；</li><li>为B注入A（此时B已健全）；</li><li>为A注入B（此时A也健全）。</li></ol><p>网上有很多相关的分析，我找了<a href="https://cloud.tencent.com/developer/article/1497692" target="_blank" rel="noopener noreferrer">一篇比较详细的</a>，可供你参考。</p><p>第二种，构造方法注入涉及循环依赖。遇到这种情况的话，程序无法启动，比如TestC和TestD的相互依赖：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class TestC {</span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    private TestD testD;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    public TestC(TestD testD) {</span></span>
<span class="line"><span>        this.testD = testD;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class TestD {</span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    private TestC testC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    public TestD(TestC testC) {</span></span>
<span class="line"><span>        this.testC = testC;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种循环依赖的主要解决方式，有2种：</p><ul><li>改为属性或字段注入；</li><li>使用@Lazy延迟注入。比如如下代码：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class TestC {</span></span>
<span class="line"><span>    @Getter</span></span>
<span class="line"><span>    private TestD testD;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    public TestC(@Lazy TestD testD) {</span></span>
<span class="line"><span>        this.testD = testD;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，这种@Lazy方式注入的就不是实际的类型了，而是代理类，获取的时候通过代理去拿值（实例化）。所以，它可以解决循环依赖无法实例化的问题。</p><h3 id="_20-spring框架-框架帮我们做了很多工作也带来了复杂度" tabindex="-1"><a class="header-anchor" href="#_20-spring框架-框架帮我们做了很多工作也带来了复杂度"><span><a href="https://time.geekbang.org/column/article/227918" target="_blank" rel="noopener noreferrer">20 | Spring框架：框架帮我们做了很多工作也带来了复杂度</a></span></a></h3><p>**问题1：**除了Spring框架这两讲涉及的execution、within、@within、@annotation 四个指示器外，Spring AOP 还支持 this、target、args、@target、@args。你能说说后面五种指示器的作用吗？</p><p>答：关于这些指示器的作用，你可以参考<a href="https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#aop-pointcuts-designators" target="_blank" rel="noopener noreferrer">官方文档</a>，文档里已经写的很清晰。</p><p>总结一下，按照使用场景，建议使用下面这些指示器：</p><ul><li>针对方法签名，使用execution；</li><li>针对类型匹配，使用within（匹配类型）、this（匹配代理类实例）、target（匹配代理背后的目标类实例）、args（匹配参数）；</li><li>针对注解匹配，使用@annotation（使用指定注解标注的方法）、@target（使用指定注解标注的类）、@args（使用指定注解标注的类作为某个方法的参数）。</li></ul><p>你可能会问，@within怎么没有呢？</p><p>其实，对于Spring默认的基于动态代理或CGLIB的AOP，因为切点只能是方法，使用@within和@target指示器并无区别；但需要注意如果切换到AspectJ，那么使用@within和@target这两个指示器的行为就会有所区别了，@within会切入更多的成员的访问（比如静态构造方法、字段访问），一般而言使用@target指示器即可。</p><p>**问题2：**Spring 的 Environment 中的 PropertySources 属性可以包含多个 PropertySource，越往前优先级越高。那，我们能否利用这个特点实现配置文件中属性值的自动赋值呢？比如，我们可以定义 %%MYSQL.URL%%、%%MYSQL.USERNAME%% 和 %%MYSQL.PASSWORD%%，分别代表数据库连接字符串、用户名和密码。在配置数据源时，我们只要设置其值为占位符，框架就可以自动根据当前应用程序名 <a href="http://application.name" target="_blank" rel="noopener noreferrer">application.name</a>，统一把占位符替换为真实的数据库信息。这样，生产的数据库信息就不需要放在配置文件中了，会更安全。</p><p>答：我们利用PropertySource具有优先级的特点，实现配置文件中属性值的自动赋值。主要逻辑是，遍历现在的属性值，找出能匹配到占位符的属性，并把这些属性的值替换为实际的数据库信息，然后再把这些替换后的属性值构成新的PropertiesPropertySource，加入PropertySources的第一个。这样，我们这个PropertiesPropertySource中的值就可以生效了。</p><p>主要源码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    Utils.loadPropertySource(CommonMistakesApplication.class, &amp;quot;db.properties&amp;quot;);</span></span>
<span class="line"><span>    new SpringApplicationBuilder()</span></span>
<span class="line"><span>            .sources(CommonMistakesApplication.class)</span></span>
<span class="line"><span>            .initializers(context -&amp;gt; initDbUrl(context.getEnvironment()))</span></span>
<span class="line"><span>            .run(args);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private static final String MYSQL_URL_PLACEHOLDER = &amp;quot;%%MYSQL.URL%%&amp;quot;;</span></span>
<span class="line"><span>private static final String MYSQL_USERNAME_PLACEHOLDER = &amp;quot;%%MYSQL.USERNAME%%&amp;quot;;</span></span>
<span class="line"><span>private static final String MYSQL_PASSWORD_PLACEHOLDER = &amp;quot;%%MYSQL.PASSWORD%%&amp;quot;;</span></span>
<span class="line"><span>private static void initDbUrl(ConfigurableEnvironment env) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String dataSourceUrl = env.getProperty(&amp;quot;spring.datasource.url&amp;quot;);</span></span>
<span class="line"><span>    String username = env.getProperty(&amp;quot;spring.datasource.username&amp;quot;);</span></span>
<span class="line"><span>    String password = env.getProperty(&amp;quot;spring.datasource.password&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (dataSourceUrl != null &amp;amp;&amp;amp; !dataSourceUrl.contains(MYSQL_URL_PLACEHOLDER))</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&amp;quot;请使用占位符&amp;quot; + MYSQL_URL_PLACEHOLDER + &amp;quot;来替换数据库URL配置！&amp;quot;);</span></span>
<span class="line"><span>    if (username != null &amp;amp;&amp;amp; !username.contains(MYSQL_USERNAME_PLACEHOLDER))</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&amp;quot;请使用占位符&amp;quot; + MYSQL_USERNAME_PLACEHOLDER + &amp;quot;来替换数据库账号配置！&amp;quot;);</span></span>
<span class="line"><span>    if (password != null &amp;amp;&amp;amp; !password.contains(MYSQL_PASSWORD_PLACEHOLDER))</span></span>
<span class="line"><span>        throw new IllegalArgumentException(&amp;quot;请使用占位符&amp;quot; + MYSQL_PASSWORD_PLACEHOLDER + &amp;quot;来替换数据库密码配置！&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //这里我把值写死了，实际应用中可以从外部服务来获取</span></span>
<span class="line"><span>    Map&amp;lt;String, String&amp;gt; property = new HashMap&amp;lt;&amp;gt;();</span></span>
<span class="line"><span>    property.put(MYSQL_URL_PLACEHOLDER, &amp;quot;jdbc:mysql://localhost:6657/common_mistakes?characterEncoding=UTF-8&amp;amp;useSSL=false&amp;quot;);</span></span>
<span class="line"><span>    property.put(MYSQL_USERNAME_PLACEHOLDER, &amp;quot;root&amp;quot;);</span></span>
<span class="line"><span>    property.put(MYSQL_PASSWORD_PLACEHOLDER, &amp;quot;kIo9u7Oi0eg&amp;quot;);</span></span>
<span class="line"><span>    //保存修改后的配置属性</span></span>
<span class="line"><span>    Properties modifiedProps = new Properties();</span></span>
<span class="line"><span>    //遍历现在的属性值，找出能匹配到占位符的属性，并把这些属性的值替换为实际的数据库信息</span></span>
<span class="line"><span>    StreamSupport.stream(env.getPropertySources().spliterator(), false)</span></span>
<span class="line"><span>            .filter(ps -&amp;gt; ps instanceof EnumerablePropertySource)</span></span>
<span class="line"><span>            .map(ps -&amp;gt; ((EnumerablePropertySource) ps).getPropertyNames())</span></span>
<span class="line"><span>            .flatMap(Arrays::stream)</span></span>
<span class="line"><span>            .forEach(propKey -&amp;gt; {</span></span>
<span class="line"><span>                String propValue = env.getProperty(propKey);</span></span>
<span class="line"><span>                property.entrySet().forEach(item -&amp;gt; {</span></span>
<span class="line"><span>                    //如果原先配置的属性值包含我们定义的占位符</span></span>
<span class="line"><span>                    if (propValue.contains(item.getKey())) {</span></span>
<span class="line"><span>                        //那么就把实际的配置信息加入modifiedProps</span></span>
<span class="line"><span>                        modifiedProps.put(propKey, propValue.replaceAll(item.getKey(), item.getValue()));</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!modifiedProps.isEmpty()) {</span></span>
<span class="line"><span>        log.info(&amp;quot;modifiedProps: {}&amp;quot;, modifiedProps);</span></span>
<span class="line"><span>        env.getPropertySources().addFirst(new PropertiesPropertySource(&amp;quot;mysql&amp;quot;, modifiedProps));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我在GitHub上第20讲对应的源码中更新了我的实现，你可以点击<a href="https://github.com/JosephZhu1983/java-common-mistakes/blob/master/src/main/java/org/geekbang/time/commonmistakes/springpart2/custompropertysource/CommonMistakesApplication.java" target="_blank" rel="noopener noreferrer">这里</a>查看。有一些同学会问，这么做的意义到底在于什么，为何不直接使用类似Apollo这样的配置框架呢？</p><p>其实，我们的目的就是不希望让开发人员手动配置数据库信息，希望程序启动的时候自动替换占位符实现自动配置（从CMDB直接拿着应用程序ID来换取对应的数据库信息。你可能会问了，一个应用程序ID对应多个数据库怎么办？其实，一般对于微服务系统来说，一个应用就应该对应一个数据库）。这样一来，除了程序其他人都不会接触到生产的数据库信息，会更安全。</p><p>以上，就是咱们这门课的第13~20讲的思考题答案了。</p><p>关于这些题目，以及背后涉及的知识点，如果你还有哪里感觉不清楚的，欢迎在评论区与我留言，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,110)]))}const d=n(p,[["render",l]]),o=JSON.parse('{"path":"/posts/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/%E4%BB%A3%E7%A0%81%E7%AF%87/%E7%AD%94%E7%96%91%E7%AF%87%EF%BC%9A%E4%BB%A3%E7%A0%81%E7%AF%87%E6%80%9D%E8%80%83%E9%A2%98%E9%9B%86%E9%94%A6%EF%BC%88%E4%B8%89%EF%BC%89.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是朱晔。 今天，我们继续一起分析这门课第13~20讲的课后思考题。这些题目涉及了日志、文件IO、序列化、Java 8日期时间类、OOM、Java高级特性（反射、注解和泛型）和Spring框架的16道问题。 接下来，我们就一一具体分析吧。 13 | 日志：日志记录真没你想象的那么简单 **问题1：**在讲“为什么我的日志会重复记录？”的案例时，我...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/%E4%BB%A3%E7%A0%81%E7%AF%87/%E7%AD%94%E7%96%91%E7%AF%87%EF%BC%9A%E4%BB%A3%E7%A0%81%E7%AF%87%E6%80%9D%E8%80%83%E9%A2%98%E9%9B%86%E9%94%A6%EF%BC%88%E4%B8%89%EF%BC%89.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是朱晔。 今天，我们继续一起分析这门课第13~20讲的课后思考题。这些题目涉及了日志、文件IO、序列化、Java 8日期时间类、OOM、Java高级特性（反射、注解和泛型）和Spring框架的16道问题。 接下来，我们就一一具体分析吧。 13 | 日志：日志记录真没你想象的那么简单 **问题1：**在讲“为什么我的日志会重复记录？”的案例时，我..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":17.96,"words":5389},"filePathRelative":"posts/Java业务开发常见错误100例/代码篇/答疑篇：代码篇思考题集锦（三）.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"答疑篇：代码篇思考题集锦（三）\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/47/92/47d7c5a60208e19a8d718e56c11d7292.mp3\\"></audio></p>\\n<p>你好，我是朱晔。</p>\\n<p>今天，我们继续一起分析这门课第13~20讲的课后思考题。这些题目涉及了日志、文件IO、序列化、Java 8日期时间类、OOM、Java高级特性（反射、注解和泛型）和Spring框架的16道问题。</p>","autoDesc":true}');export{d as comp,o as data};
