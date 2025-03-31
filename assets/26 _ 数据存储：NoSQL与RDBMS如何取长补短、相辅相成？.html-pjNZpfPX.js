import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-6Bz2fGO5.js";const l={};function p(t,n){return e(),a("div",null,n[0]||(n[0]=[i(`<p><audio id="audio" title="26 | 数据存储：NoSQL与RDBMS如何取长补短、相辅相成？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/99/74/99d6bb4b14d87138e87148d987122274.mp3"></audio></p><p>你好，我是朱晔。今天，我来和你聊聊数据存储的常见错误。</p><p>近几年，各种非关系型数据库，也就是NoSQL发展迅猛，在项目中也非常常见。其中不乏一些使用上的极端情况，比如直接把关系型数据库（RDBMS）全部替换为NoSQL，或是在不合适的场景下错误地使用NoSQL。</p><p>其实，每种NoSQL的特点不同，都有其要着重解决的某一方面的问题。因此，我们在使用NoSQL的时候，要尽量让它去处理擅长的场景，否则不但发挥不出它的功能和优势，还可能会导致性能问题。</p><p>NoSQL一般可以分为缓存数据库、时间序列数据库、全文搜索数据库、文档数据库、图数据库等。今天，我会以缓存数据库Redis、时间序列数据库InfluxDB、全文搜索数据库ElasticSearch为例，通过一些测试案例，和你聊聊这些常见NoSQL的特点，以及它们擅长和不擅长的地方。最后，我也还会和你说说NoSQL如何与RDBMS相辅相成，来构成一套可以应对高并发的复合数据库体系。</p><h2 id="取长补短之-redis-vs-mysql" tabindex="-1"><a class="header-anchor" href="#取长补短之-redis-vs-mysql"><span>取长补短之 Redis vs MySQL</span></a></h2><p>Redis是一款设计简洁的缓存数据库，数据都保存在内存中，所以读写单一Key的性能非常高。</p><p>我们来做一个简单测试，分别填充10万条数据到Redis和MySQL中。MySQL中的name字段做了索引，相当于Redis的Key，data字段为100字节的数据，相当于Redis的Value：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class CommonMistakesApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //模拟10万条数据存到Redis和MySQL</span></span>
<span class="line"><span>    public static final int ROWS = 100000;</span></span>
<span class="line"><span>    public static final String PAYLOAD = IntStream.rangeClosed(1, 100).mapToObj(__ -&amp;gt; &amp;quot;a&amp;quot;).collect(Collectors.joining(&amp;quot;&amp;quot;));</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private StringRedisTemplate stringRedisTemplate;</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private JdbcTemplate jdbcTemplate;</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private StandardEnvironment standardEnvironment;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SpringApplication.run(CommonMistakesApplication.class, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @PostConstruct</span></span>
<span class="line"><span>    public void init() {</span></span>
<span class="line"><span>        //使用-Dspring.profiles.active=init启动程序进行初始化</span></span>
<span class="line"><span>        if (Arrays.stream(standardEnvironment.getActiveProfiles()).anyMatch(s -&amp;gt; s.equalsIgnoreCase(&amp;quot;init&amp;quot;))) {</span></span>
<span class="line"><span>            initRedis();</span></span>
<span class="line"><span>            initMySQL();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //填充数据到MySQL</span></span>
<span class="line"><span>    private void initMySQL() {</span></span>
<span class="line"><span>        //删除表</span></span>
<span class="line"><span>        jdbcTemplate.execute(&amp;quot;DROP TABLE IF EXISTS \`r\`;&amp;quot;);</span></span>
<span class="line"><span>        //新建表，name字段做了索引</span></span>
<span class="line"><span>        jdbcTemplate.execute(&amp;quot;CREATE TABLE \`r\` (\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  \`data\` varchar(2000) NOT NULL,\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  \`name\` varchar(20) NOT NULL,\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  PRIMARY KEY (\`id\`),\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  KEY \`name\` (\`name\`) USING BTREE\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //批量插入数据</span></span>
<span class="line"><span>        String sql = &amp;quot;INSERT INTO \`r\` (\`data\`,\`name\`) VALUES (?,?)&amp;quot;;</span></span>
<span class="line"><span>        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {</span></span>
<span class="line"><span>                preparedStatement.setString(1, PAYLOAD);</span></span>
<span class="line"><span>                preparedStatement.setString(2, &amp;quot;item&amp;quot; + i);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public int getBatchSize() {</span></span>
<span class="line"><span>                return ROWS;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        log.info(&amp;quot;init mysql finished with count {}&amp;quot;, jdbcTemplate.queryForObject(&amp;quot;SELECT COUNT(*) FROM \`r\`&amp;quot;, Long.class));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //填充数据到Redis</span></span>
<span class="line"><span>    private void initRedis() {</span></span>
<span class="line"><span>        IntStream.rangeClosed(1, ROWS).forEach(i -&amp;gt; stringRedisTemplate.opsForValue().set(&amp;quot;item&amp;quot; + i, PAYLOAD));</span></span>
<span class="line"><span>        log.info(&amp;quot;init redis finished with count {}&amp;quot;, stringRedisTemplate.keys(&amp;quot;item*&amp;quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动程序后，输出了如下日志，数据全部填充完毕：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[14:22:47.195] [main] [INFO ] [o.g.t.c.n.r.CommonMistakesApplication:80  ] - init redis finished with count 100000</span></span>
<span class="line"><span>[14:22:50.030] [main] [INFO ] [o.g.t.c.n.r.CommonMistakesApplication:74  ] - init mysql finished with count 100000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，比较一下从MySQL和Redis随机读取单条数据的性能。“公平”起见，像Redis那样，我们使用MySQL时也根据Key来查Value，也就是根据name字段来查data字段，并且我们给name字段做了索引：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>private JdbcTemplate jdbcTemplate;</span></span>
<span class="line"><span>@Autowired</span></span>
<span class="line"><span>private StringRedisTemplate stringRedisTemplate;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@GetMapping(&amp;quot;redis&amp;quot;)</span></span>
<span class="line"><span>public void redis() {</span></span>
<span class="line"><span>    //使用随机的Key来查询Value，结果应该等于PAYLOAD</span></span>
<span class="line"><span>    Assert.assertTrue(stringRedisTemplate.opsForValue().get(&amp;quot;item&amp;quot; + (ThreadLocalRandom.current().nextInt(CommonMistakesApplication.ROWS) + 1)).equals(CommonMistakesApplication.PAYLOAD));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@GetMapping(&amp;quot;mysql&amp;quot;)</span></span>
<span class="line"><span>public void mysql() {</span></span>
<span class="line"><span>    //根据随机name来查data，name字段有索引，结果应该等于PAYLOAD</span></span>
<span class="line"><span>    Assert.assertTrue(jdbcTemplate.queryForObject(&amp;quot;SELECT data FROM \`r\` WHERE name=?&amp;quot;, new Object[]{(&amp;quot;item&amp;quot; + (ThreadLocalRandom.current().nextInt(CommonMistakesApplication.ROWS) + 1))}, String.class)</span></span>
<span class="line"><span>            .equals(CommonMistakesApplication.PAYLOAD));</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在我的电脑上，使用wrk 加10个线程50个并发连接做压测。可以看到，MySQL 90%的请求需要61ms，QPS为1460；<strong>而Redis 90%的请求在5ms左右，QPS达到了14008，几乎是MySQL的十倍</strong>：</p><img src="https://static001.geekbang.org/resource/image/2d/4e/2d289cc94097c2e62aa97a6602d0554e.png" alt=""><p>但Redis薄弱的地方是，不擅长做Key的搜索。对MySQL，我们可以使用LIKE操作前匹配走B+树索引实现快速搜索；但对Redis，我们使用Keys命令对Key的搜索，其实相当于在MySQL里做全表扫描。</p><p>我写一段代码来对比一下性能：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@GetMapping(&amp;quot;redis2&amp;quot;)</span></span>
<span class="line"><span>public void redis2() {</span></span>
<span class="line"><span>    Assert.assertTrue(stringRedisTemplate.keys(&amp;quot;item71*&amp;quot;).size() == 1111);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@GetMapping(&amp;quot;mysql2&amp;quot;)</span></span>
<span class="line"><span>public void mysql2() {</span></span>
<span class="line"><span>    Assert.assertTrue(jdbcTemplate.queryForList(&amp;quot;SELECT name FROM \`r\` WHERE name LIKE &#39;item71%&#39;&amp;quot;, String.class).size() == 1111);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，在QPS方面，<strong>MySQL的QPS达到了Redis的157倍；在延迟方面，MySQL的延迟只有Redis的十分之一。</strong></p><img src="https://static001.geekbang.org/resource/image/5d/e8/5de7a4a7bf27f8736b0ac09ba0dd1fe8.png" alt=""><p>Redis慢的原因有两个：</p><ul><li>Redis的Keys命令是O(n)时间复杂度。如果数据库中Key的数量很多，就会非常慢。</li><li>Redis是单线程的，对于慢的命令如果有并发，串行执行就会非常耗时。</li></ul><p>一般而言，我们使用Redis都是针对某一个Key来使用，而不能在业务代码中使用Keys命令从Redis中“搜索数据”，因为这不是Redis的擅长。对于Key的搜索，我们可以先通过关系型数据库进行，然后再从Redis存取数据（如果实在需要搜索Key可以使用SCAN命令）。在生产环境中，我们一般也会配置Redis禁用类似Keys这种比较危险的命令，你可以<a href="https://redis.io/topics/security" target="_blank" rel="noopener noreferrer">参考这里</a>。</p><p>总结一下，正如“<a href="https://time.geekbang.org/column/article/231501" target="_blank" rel="noopener noreferrer">缓存设计</a>”一讲中提到的，对于业务开发来说，大多数业务场景下Redis是作为关系型数据库的辅助用于缓存的，我们一般不会把它当作数据库独立使用。</p><p>此外值得一提的是，Redis提供了丰富的数据结构（Set、SortedSet、Hash、List），并围绕这些数据结构提供了丰富的API。如果我们好好利用这个特点的话，可以直接在Redis中完成一部分服务端计算，避免“读取缓存-&gt;计算数据-&gt;保存缓存”三部曲中的读取和保存缓存的开销，进一步提高性能。</p><h2 id="取长补短之-influxdb-vs-mysql" tabindex="-1"><a class="header-anchor" href="#取长补短之-influxdb-vs-mysql"><span>取长补短之 InfluxDB vs MySQL</span></a></h2><p>InfluxDB是一款优秀的时序数据库。在“<a href="https://time.geekbang.org/column/article/231568" target="_blank" rel="noopener noreferrer">生产就绪</a>”这一讲中，我们就是使用InfluxDB来做的Metrics打点。时序数据库的优势，在于处理指标数据的聚合，并且读写效率非常高。</p><p>同样的，我们使用一些测试来对比下InfluxDB和MySQL的性能。</p><p>在如下代码中，我们分别填充了1000万条数据到MySQL和InfluxDB中。其中，每条数据只有ID、时间戳、10000以内的随机值这3列信息，对于MySQL我们把时间戳列做了索引：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>public class CommonMistakesApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        SpringApplication.run(CommonMistakesApplication.class, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //测试数据量</span></span>
<span class="line"><span>    public static final int ROWS = 10000000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private JdbcTemplate jdbcTemplate;</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private StandardEnvironment standardEnvironment;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @PostConstruct</span></span>
<span class="line"><span>    public void init() {</span></span>
<span class="line"><span>        //使用-Dspring.profiles.active=init启动程序进行初始化</span></span>
<span class="line"><span>        if (Arrays.stream(standardEnvironment.getActiveProfiles()).anyMatch(s -&amp;gt; s.equalsIgnoreCase(&amp;quot;init&amp;quot;))) {</span></span>
<span class="line"><span>            initInfluxDB();</span></span>
<span class="line"><span>            initMySQL();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化MySQL</span></span>
<span class="line"><span>    private void initMySQL() {</span></span>
<span class="line"><span>        long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>        jdbcTemplate.execute(&amp;quot;DROP TABLE IF EXISTS \`m\`;&amp;quot;);</span></span>
<span class="line"><span>        //只有ID、值和时间戳三列</span></span>
<span class="line"><span>        jdbcTemplate.execute(&amp;quot;CREATE TABLE \`m\` (\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  \`value\` bigint NOT NULL,\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  \`time\` timestamp NOT NULL,\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  PRIMARY KEY (\`id\`),\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;  KEY \`time\` (\`time\`) USING BTREE\\n&amp;quot; +</span></span>
<span class="line"><span>                &amp;quot;) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;&amp;quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        String sql = &amp;quot;INSERT INTO \`m\` (\`value\`,\`time\`) VALUES (?,?)&amp;quot;;</span></span>
<span class="line"><span>        //批量插入数据</span></span>
<span class="line"><span>        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {</span></span>
<span class="line"><span>                preparedStatement.setLong(1, ThreadLocalRandom.current().nextInt(10000));</span></span>
<span class="line"><span>                preparedStatement.setTimestamp(2, Timestamp.valueOf(LocalDateTime.now().minusSeconds(5 * i)));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public int getBatchSize() {</span></span>
<span class="line"><span>                return ROWS;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        log.info(&amp;quot;init mysql finished with count {} took {}ms&amp;quot;, jdbcTemplate.queryForObject(&amp;quot;SELECT COUNT(*) FROM \`m\`&amp;quot;, Long.class), System.currentTimeMillis()-begin);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //初始化InfluxDB</span></span>
<span class="line"><span>    private void initInfluxDB() {</span></span>
<span class="line"><span>        long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>        OkHttpClient.Builder okHttpClientBuilder = new OkHttpClient().newBuilder()</span></span>
<span class="line"><span>                .connectTimeout(1, TimeUnit.SECONDS)</span></span>
<span class="line"><span>                .readTimeout(10, TimeUnit.SECONDS)</span></span>
<span class="line"><span>                .writeTimeout(10, TimeUnit.SECONDS);</span></span>
<span class="line"><span>        try (InfluxDB influxDB = InfluxDBFactory.connect(&amp;quot;http://127.0.0.1:8086&amp;quot;, &amp;quot;root&amp;quot;, &amp;quot;root&amp;quot;, okHttpClientBuilder)) {</span></span>
<span class="line"><span>            String db = &amp;quot;performance&amp;quot;;</span></span>
<span class="line"><span>            influxDB.query(new Query(&amp;quot;DROP DATABASE &amp;quot; + db));</span></span>
<span class="line"><span>            influxDB.query(new Query(&amp;quot;CREATE DATABASE &amp;quot; + db));</span></span>
<span class="line"><span>            //设置数据库</span></span>
<span class="line"><span>            influxDB.setDatabase(db);</span></span>
<span class="line"><span>            //批量插入，10000条数据刷一次，或1秒刷一次</span></span>
<span class="line"><span>            influxDB.enableBatch(BatchOptions.DEFAULTS.actions(10000).flushDuration(1000));</span></span>
<span class="line"><span>            IntStream.rangeClosed(1, ROWS).mapToObj(i -&amp;gt; Point</span></span>
<span class="line"><span>                    .measurement(&amp;quot;m&amp;quot;)</span></span>
<span class="line"><span>                    .addField(&amp;quot;value&amp;quot;, ThreadLocalRandom.current().nextInt(10000))</span></span>
<span class="line"><span>                    .time(LocalDateTime.now().minusSeconds(5 * i).toInstant(ZoneOffset.UTC).toEpochMilli(), TimeUnit.MILLISECONDS).build())</span></span>
<span class="line"><span>                    .forEach(influxDB::write);</span></span>
<span class="line"><span>            influxDB.flush();</span></span>
<span class="line"><span>            log.info(&amp;quot;init influxdb finished with count {} took {}ms&amp;quot;, influxDB.query(new Query(&amp;quot;SELECT COUNT(*) FROM m&amp;quot;)).getResults().get(0).getSeries().get(0).getValues().get(0).get(1), System.currentTimeMillis()-begin);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动后，程序输出了如下日志：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[16:08:25.062] [main] [INFO ] [o.g.t.c.n.i.CommonMistakesApplication:104 ] - init influxdb finished with count 1.0E7 took 54280ms</span></span>
<span class="line"><span>[16:11:50.462] [main] [INFO ] [o.g.t.c.n.i.CommonMistakesApplication:80  ] - init mysql finished with count 10000000 took 205394ms</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>InfluxDB批量插入1000万条数据仅用了54秒，相当于每秒插入18万条数据，速度相当快；MySQL的批量插入，速度也挺快达到了每秒4.8万。</p><p>接下来，我们测试一下。</p><p>对这1000万数据进行一个统计，查询最近60天的数据，按照1小时的时间粒度聚合，统计value列的最大值、最小值和平均值，并将统计结果绘制成曲线图：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>private JdbcTemplate jdbcTemplate;</span></span>
<span class="line"><span>@GetMapping(&amp;quot;mysql&amp;quot;)</span></span>
<span class="line"><span>public void mysql() {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    //使用SQL从MySQL查询，按照小时分组</span></span>
<span class="line"><span>    Object result = jdbcTemplate.queryForList(&amp;quot;SELECT date_format(time,&#39;%Y%m%d%H&#39;),max(value),min(value),avg(value) FROM m WHERE time&amp;gt;now()- INTERVAL 60 DAY GROUP BY date_format(time,&#39;%Y%m%d%H&#39;)&amp;quot;);</span></span>
<span class="line"><span>    log.info(&amp;quot;took {} ms result {}&amp;quot;, System.currentTimeMillis() - begin, result);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>@GetMapping(&amp;quot;influxdb&amp;quot;)</span></span>
<span class="line"><span>public void influxdb() {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    try (InfluxDB influxDB = InfluxDBFactory.connect(&amp;quot;http://127.0.0.1:8086&amp;quot;, &amp;quot;root&amp;quot;, &amp;quot;root&amp;quot;)) {</span></span>
<span class="line"><span>        //切换数据库</span></span>
<span class="line"><span>        influxDB.setDatabase(&amp;quot;performance&amp;quot;);</span></span>
<span class="line"><span>        //InfluxDB的查询语法InfluxQL类似SQL</span></span>
<span class="line"><span>        Object result = influxDB.query(new Query(&amp;quot;SELECT MEAN(value),MIN(value),MAX(value) FROM m WHERE time &amp;gt; now() - 60d GROUP BY TIME(1h)&amp;quot;));</span></span>
<span class="line"><span>        log.info(&amp;quot;took {} ms result {}&amp;quot;, System.currentTimeMillis() - begin, result);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为数据量非常大，单次查询就已经很慢了，所以这次我们不进行压测。分别调用两个接口，可以看到<strong>MySQL查询一次耗时29秒左右，而InfluxDB耗时980ms</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[16:19:26.562] [http-nio-45678-exec-1] [INFO ] [o.g.t.c.n.i.PerformanceController:31  ] - took 28919 ms result [{date_format(time,&#39;%Y%m%d%H&#39;)=2019121308, max(value)=9993, min(value)=4, avg(value)=5129.5639}, {date_format(time,&#39;%Y%m%d%H&#39;)=2019121309, max(value)=9990, min(value)=12, avg(value)=4856.0556}, {date_format(time,&#39;%Y%m%d%H&#39;)=2019121310, max(value)=9998, min(value)=8, avg(value)=4948.9347}, {date_format(time,&#39;%Y%m%d%H&#39;)...</span></span>
<span class="line"><span>[16:20:08.170] [http-nio-45678-exec-6] [INFO ] [o.g.t.c.n.i.PerformanceController:40  ] - took 981 ms result QueryResult [results=[Result [series=[Series [name=m, tags=null, columns=[time, mean, min, max], values=[[2019-12-13T08:00:00Z, 5249.2468619246865, 21.0, 9992.0],...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>在按照时间区间聚合的案例上，我们看到了InfluxDB的性能优势。但，我们<strong>肯定不能把InfluxDB当作普通数据库</strong>，原因是：</p><ul><li>InfluxDB不支持数据更新操作，毕竟时间数据只能随着时间产生新数据，肯定无法对过去的数据做修改；</li><li>从数据结构上说，时间序列数据数据没有单一的主键标识，必须包含时间戳，数据只能和时间戳进行关联，不适合普通业务数据。</li></ul><p><strong>此外需要注意，即便只是使用InfluxDB保存和时间相关的指标数据，我们也要注意不能滥用tag</strong>。</p><p>InfluxDB提供的tag功能，可以为每一个指标设置多个标签，并且tag有索引，可以对tag进行条件搜索或分组。但是，tag只能保存有限的、可枚举的标签，不能保存URL等信息，否则可能会出现<a href="https://docs.influxdata.com/influxdb/v1.7/concepts/schema_and_data_layout/#don-t-have-too-many-serieshigh%20series%20cardinality" target="_blank" rel="noopener noreferrer">high series cardinality问题</a>，导致占用大量内存，甚至是OOM。你可以点击<a href="https://docs.influxdata.com/influxdb/v1.7/guides/hardware_sizing/" target="_blank" rel="noopener noreferrer">这里</a>，查看series和内存占用的关系。对于InfluxDB，我们无法把URL这种原始数据保存到数据库中，只能把数据进行归类，形成有限的tag进行保存。</p><p>总结一下，对于MySQL而言，针对大量的数据使用全表扫描的方式来聚合统计指标数据，性能非常差，一般只能作为临时方案来使用。此时，引入InfluxDB之类的时间序列数据库，就很有必要了。时间序列数据库可以作为特定场景（比如监控、统计）的主存储，也可以和关系型数据库搭配使用，作为一个辅助数据源，保存业务系统的指标数据。</p><h2 id="取长补短之-elasticsearch-vs-mysql" tabindex="-1"><a class="header-anchor" href="#取长补短之-elasticsearch-vs-mysql"><span>取长补短之 Elasticsearch vs MySQL</span></a></h2><p>Elasticsearch（以下简称ES），是目前非常流行的分布式搜索和分析数据库，独特的倒排索引结构尤其适合进行全文搜索。</p><p>简单来讲，倒排索引可以认为是一个Map，其Key是分词之后的关键字，Value是文档ID/片段ID的列表。我们只要输入需要搜索的单词，就可以直接在这个Map中得到所有包含这个单词的文档ID/片段ID列表，然后再根据其中的文档ID/片段ID查询出实际的文档内容。</p><p>我们来测试一下，对比下使用ES进行关键字全文搜索、在MySQL中使用LIKE进行搜索的效率差距。</p><p>首先，定义一个实体News，包含新闻分类、标题、内容等字段。这个实体同时会用作Spring Data JPA和Spring Data Elasticsearch的实体：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Entity</span></span>
<span class="line"><span>@Document(indexName = &amp;quot;news&amp;quot;, replicas = 0) //@Document注解定义了这是一个ES的索引，索引名称news，数据不需要冗余</span></span>
<span class="line"><span>@Table(name = &amp;quot;news&amp;quot;, indexes = {@Index(columnList = &amp;quot;cateid&amp;quot;)}) //@Table注解定义了这是一个MySQL表，表名news，对cateid列做索引</span></span>
<span class="line"><span>@Data</span></span>
<span class="line"><span>@AllArgsConstructor</span></span>
<span class="line"><span>@NoArgsConstructor</span></span>
<span class="line"><span>@DynamicUpdate</span></span>
<span class="line"><span>public class News {</span></span>
<span class="line"><span>    @Id</span></span>
<span class="line"><span>    private long id;</span></span>
<span class="line"><span>    @Field(type = FieldType.Keyword)</span></span>
<span class="line"><span>    private String category;//新闻分类名称</span></span>
<span class="line"><span>    private int cateid;//新闻分类ID</span></span>
<span class="line"><span>    @Column(columnDefinition = &amp;quot;varchar(500)&amp;quot;)//@Column注解定义了在MySQL中字段，比如这里定义title列的类型是varchar(500)</span></span>
<span class="line"><span>    @Field(type = FieldType.Text, analyzer = &amp;quot;ik_max_word&amp;quot;, searchAnalyzer = &amp;quot;ik_smart&amp;quot;)//@Field注解定义了ES字段的格式，使用ik分词器进行分词</span></span>
<span class="line"><span>    private String title;//新闻标题</span></span>
<span class="line"><span>    @Column(columnDefinition = &amp;quot;text&amp;quot;)</span></span>
<span class="line"><span>    @Field(type = FieldType.Text, analyzer = &amp;quot;ik_max_word&amp;quot;, searchAnalyzer = &amp;quot;ik_smart&amp;quot;)</span></span>
<span class="line"><span>    private String content;//新闻内容</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，我们实现主程序。在启动时，我们会从一个csv文件中加载4000条新闻数据，然后复制100份，拼成40万条数据，分别写入MySQL和ES：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>@Slf4j</span></span>
<span class="line"><span>@EnableElasticsearchRepositories(includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = NewsESRepository.class)) //明确设置哪个是ES的Repository</span></span>
<span class="line"><span>@EnableJpaRepositories(excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = NewsESRepository.class)) //其他的是MySQL的Repository</span></span>
<span class="line"><span>public class CommonMistakesApplication {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Utils.loadPropertySource(CommonMistakesApplication.class, &amp;quot;es.properties&amp;quot;);</span></span>
<span class="line"><span>        SpringApplication.run(CommonMistakesApplication.class, args);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private StandardEnvironment standardEnvironment;</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private NewsESRepository newsESRepository;</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private NewsMySQLRepository newsMySQLRepository;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @PostConstruct</span></span>
<span class="line"><span>    public void init() {</span></span>
<span class="line"><span>        //使用-Dspring.profiles.active=init启动程序进行初始化</span></span>
<span class="line"><span>        if (Arrays.stream(standardEnvironment.getActiveProfiles()).anyMatch(s -&amp;gt; s.equalsIgnoreCase(&amp;quot;init&amp;quot;))) {</span></span>
<span class="line"><span>            //csv中的原始数据只有4000条</span></span>
<span class="line"><span>            List&amp;lt;News&amp;gt; news = loadData();</span></span>
<span class="line"><span>            AtomicLong atomicLong = new AtomicLong();</span></span>
<span class="line"><span>            news.forEach(item -&amp;gt; item.setTitle(&amp;quot;%%&amp;quot; + item.getTitle()));</span></span>
<span class="line"><span>            //我们模拟100倍的数据量，也就是40万条</span></span>
<span class="line"><span>            IntStream.rangeClosed(1, 100).forEach(repeat -&amp;gt; {</span></span>
<span class="line"><span>                news.forEach(item -&amp;gt; {</span></span>
<span class="line"><span>                    //重新设置主键ID</span></span>
<span class="line"><span>                    item.setId(atomicLong.incrementAndGet());</span></span>
<span class="line"><span>                    //每次复制数据稍微改一下title字段，在前面加上一个数字，代表这是第几次复制</span></span>
<span class="line"><span>                    item.setTitle(item.getTitle().replaceFirst(&amp;quot;%%&amp;quot;, String.valueOf(repeat)));</span></span>
<span class="line"><span>                });</span></span>
<span class="line"><span>                initMySQL(news, repeat == 1);</span></span>
<span class="line"><span>                log.info(&amp;quot;init MySQL finished for {}&amp;quot;, repeat);</span></span>
<span class="line"><span>                initES(news, repeat == 1);</span></span>
<span class="line"><span>                log.info(&amp;quot;init ES finished for {}&amp;quot;, repeat);</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //从news.csv中解析得到原始数据</span></span>
<span class="line"><span>    private List&amp;lt;News&amp;gt; loadData() {</span></span>
<span class="line"><span>        //使用jackson-dataformat-csv实现csv到POJO的转换</span></span>
<span class="line"><span>        CsvMapper csvMapper = new CsvMapper();</span></span>
<span class="line"><span>        CsvSchema schema = CsvSchema.emptySchema().withHeader();</span></span>
<span class="line"><span>        ObjectReader objectReader = csvMapper.readerFor(News.class).with(schema);</span></span>
<span class="line"><span>        ClassLoader classLoader = getClass().getClassLoader();</span></span>
<span class="line"><span>        File file = new File(classLoader.getResource(&amp;quot;news.csv&amp;quot;).getFile());</span></span>
<span class="line"><span>        try (Reader reader = new FileReader(file)) {</span></span>
<span class="line"><span>            return objectReader.&amp;lt;News&amp;gt;readValues(reader).readAll();</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //把数据保存到ES中</span></span>
<span class="line"><span>    private void initES(List&amp;lt;News&amp;gt; news, boolean clear) {</span></span>
<span class="line"><span>        if (clear) {</span></span>
<span class="line"><span>            //首次调用的时候先删除历史数据</span></span>
<span class="line"><span>            newsESRepository.deleteAll();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        newsESRepository.saveAll(news);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //把数据保存到MySQL中</span></span>
<span class="line"><span>    private void initMySQL(List&amp;lt;News&amp;gt; news, boolean clear) {</span></span>
<span class="line"><span>        if (clear) {</span></span>
<span class="line"><span>            //首次调用的时候先删除历史数据</span></span>
<span class="line"><span>            newsMySQLRepository.deleteAll();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        newsMySQLRepository.saveAll(news);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于我们使用了Spring Data，直接定义两个Repository，然后直接定义查询方法，无需实现任何逻辑即可实现查询，Spring Data会根据方法名生成相应的SQL语句和ES查询DSL，其中ES的翻译逻辑<a href="https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#elasticsearch.query-methods.criterions" target="_blank" rel="noopener noreferrer">详见这里</a>。</p><p>在这里，我们定义一个countByCateidAndContentContainingAndContentContaining方法，代表查询条件是：搜索分类等于cateid参数，且内容同时包含关键字keyword1和keyword2，计算符合条件的新闻总数量：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface NewsMySQLRepository extends JpaRepository&amp;lt;News, Long&amp;gt; {</span></span>
<span class="line"><span>    //JPA：搜索分类等于cateid参数，且内容同时包含关键字keyword1和keyword2，计算符合条件的新闻总数量</span></span>
<span class="line"><span>    long countByCateidAndContentContainingAndContentContaining(int cateid, String keyword1, String keyword2);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Repository</span></span>
<span class="line"><span>public interface NewsESRepository extends ElasticsearchRepository&amp;lt;News, Long&amp;gt; {</span></span>
<span class="line"><span>    //ES：搜索分类等于cateid参数，且内容同时包含关键字keyword1和keyword2，计算符合条件的新闻总数量</span></span>
<span class="line"><span>    long countByCateidAndContentContainingAndContentContaining(int cateid, String keyword1, String keyword2);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于ES和MySQL，我们使用相同的条件进行搜索，搜素分类是1，关键字是社会和苹果，然后输出搜索结果和耗时：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>//测试MySQL搜索，最后输出耗时和结果</span></span>
<span class="line"><span>@GetMapping(&amp;quot;mysql&amp;quot;)</span></span>
<span class="line"><span>public void mysql(@RequestParam(value = &amp;quot;cateid&amp;quot;, defaultValue = &amp;quot;1&amp;quot;) int cateid,</span></span>
<span class="line"><span>                  @RequestParam(value = &amp;quot;keyword1&amp;quot;, defaultValue = &amp;quot;社会&amp;quot;) String keyword1,</span></span>
<span class="line"><span>                  @RequestParam(value = &amp;quot;keyword2&amp;quot;, defaultValue = &amp;quot;苹果&amp;quot;) String keyword2) {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    Object result = newsMySQLRepository.countByCateidAndContentContainingAndContentContaining(cateid, keyword1, keyword2);</span></span>
<span class="line"><span>    log.info(&amp;quot;took {} ms result {}&amp;quot;, System.currentTimeMillis() - begin, result);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//测试ES搜索，最后输出耗时和结果</span></span>
<span class="line"><span>@GetMapping(&amp;quot;es&amp;quot;)</span></span>
<span class="line"><span>public void es(@RequestParam(value = &amp;quot;cateid&amp;quot;, defaultValue = &amp;quot;1&amp;quot;) int cateid,</span></span>
<span class="line"><span>               @RequestParam(value = &amp;quot;keyword1&amp;quot;, defaultValue = &amp;quot;社会&amp;quot;) String keyword1,</span></span>
<span class="line"><span>               @RequestParam(value = &amp;quot;keyword2&amp;quot;, defaultValue = &amp;quot;苹果&amp;quot;) String keyword2) {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    Object result = newsESRepository.countByCateidAndContentContainingAndContentContaining(cateid, keyword1, keyword2);</span></span>
<span class="line"><span>    log.info(&amp;quot;took {} ms result {}&amp;quot;, System.currentTimeMillis() - begin, result);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分别调用接口可以看到，<strong>ES耗时仅仅48ms，MySQL耗时6秒多是ES的100倍</strong>。很遗憾，虽然新闻分类ID已经建了索引，但是这个索引只能起到加速过滤分类ID这一单一条件的作用，对于文本内容的全文搜索，B+树索引无能为力。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>[22:04:00.951] [http-nio-45678-exec-6] [INFO ] [o.g.t.c.n.esvsmyql.PerformanceController:48  ] - took 48 ms result 2100</span></span>
<span class="line"><span>Hibernate: select count(news0_.id) as col_0_0_ from news news0_ where news0_.cateid=? and (news0_.content like ? escape ?) and (news0_.content like ? escape ?)</span></span>
<span class="line"><span>[22:04:11.946] [http-nio-45678-exec-7] [INFO ] [o.g.t.c.n.esvsmyql.PerformanceController:39  ] - took 6637 ms result 2100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但ES这种以索引为核心的数据库，也不是万能的，频繁更新就是一个大问题。</p><p>MySQL可以做到仅更新某行数据的某个字段，但ES里每次数据字段更新都相当于整个文档索引重建。即便ES提供了文档部分更新的功能，但本质上只是节省了提交文档的网络流量，以及减少了更新冲突，其内部实现还是文档删除后重新构建索引。因此，如果要在ES中保存一个类似计数器的值，要实现不断更新，其执行效率会非常低。</p><p>我们来验证下，分别使用JdbcTemplate+SQL语句、ElasticsearchTemplate+自定义UpdateQuery，实现部分更新MySQL表和ES索引的一个字段，每个方法都是循环更新1000次：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>@GetMapping(&amp;quot;mysql2&amp;quot;)</span></span>
<span class="line"><span>public void mysql2(@RequestParam(value = &amp;quot;id&amp;quot;, defaultValue = &amp;quot;400000&amp;quot;) long id) {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    //对于MySQL，使用JdbcTemplate+SQL语句，实现直接更新某个category字段，更新1000次</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, 1000).forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        jdbcTemplate.update(&amp;quot;UPDATE \`news\` SET category=? WHERE id=?&amp;quot;, new Object[]{&amp;quot;test&amp;quot; + i, id});</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    log.info(&amp;quot;mysql took {} ms result {}&amp;quot;, System.currentTimeMillis() - begin, newsMySQLRepository.findById(id));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@GetMapping(&amp;quot;es2&amp;quot;)</span></span>
<span class="line"><span>public void es(@RequestParam(value = &amp;quot;id&amp;quot;, defaultValue = &amp;quot;400000&amp;quot;) long id) {</span></span>
<span class="line"><span>    long begin = System.currentTimeMillis();</span></span>
<span class="line"><span>    IntStream.rangeClosed(1, 1000).forEach(i -&amp;gt; {</span></span>
<span class="line"><span>        //对于ES，通过ElasticsearchTemplate+自定义UpdateQuery，实现文档的部分更新</span></span>
<span class="line"><span>        UpdateQuery updateQuery = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            updateQuery = new UpdateQueryBuilder()</span></span>
<span class="line"><span>                    .withIndexName(&amp;quot;news&amp;quot;)</span></span>
<span class="line"><span>                    .withId(String.valueOf(id))</span></span>
<span class="line"><span>                    .withType(&amp;quot;_doc&amp;quot;)</span></span>
<span class="line"><span>                    .withUpdateRequest(new UpdateRequest().doc(</span></span>
<span class="line"><span>                            jsonBuilder()</span></span>
<span class="line"><span>                                    .startObject()</span></span>
<span class="line"><span>                                    .field(&amp;quot;category&amp;quot;, &amp;quot;test&amp;quot; + i)</span></span>
<span class="line"><span>                                    .endObject()))</span></span>
<span class="line"><span>                    .build();</span></span>
<span class="line"><span>        } catch (IOException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        elasticsearchTemplate.update(updateQuery);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    log.info(&amp;quot;es took {} ms result {}&amp;quot;, System.currentTimeMillis() - begin, newsESRepository.findById(id).get());</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，<strong>MySQL耗时仅仅1.5秒，而ES耗时6.8秒</strong>：</p><img src="https://static001.geekbang.org/resource/image/63/02/63a583a0bced67a3f7cf0eb32e644802.png" alt=""><p>ES是一个分布式的全文搜索数据库，所以与MySQL相比的优势在于文本搜索，而且因为其分布式的特性，可以使用一个大ES集群处理大规模数据的内容搜索。但，由于ES的索引是文档维度的，所以不适用于频繁更新的OLTP业务。</p><p>一般而言，我们会把ES和MySQL结合使用，MySQL直接承担业务系统的增删改操作，而ES作为辅助数据库，直接扁平化保存一份业务数据，用于复杂查询、全文搜索和统计。接下来，我也会继续和你分析这一点。</p><h2 id="结合nosql和mysql应对高并发的复合数据库架构" tabindex="-1"><a class="header-anchor" href="#结合nosql和mysql应对高并发的复合数据库架构"><span>结合NoSQL和MySQL应对高并发的复合数据库架构</span></a></h2><p>现在，我们通过一些案例看到了Redis、InfluxDB、ES这些NoSQL数据库，都有擅长和不擅长的场景。那么，有没有全能的数据库呢？</p><p>我认为没有。每一个存储系统都有其独特的数据结构，数据结构的设计就决定了其擅长和不擅长的场景。</p><p>比如，MySQL InnoDB引擎的B+树对排序和范围查询友好，频繁数据更新的代价不是太大，因此适合OLTP（On-Line Transaction Processing）。</p><p>又比如，ES的Lucene采用了FST（Finite State Transducer）索引+倒排索引，空间效率高，适合对变动不频繁的数据做索引，实现全文搜索。存储系统本身不可能对一份数据使用多种数据结构保存，因此不可能适用于所有场景。</p><p>虽然在大多数业务场景下，MySQL的性能都不算太差，但对于数据量大、访问量大、业务复杂的互联网应用来说，MySQL因为实现了ACID（原子性、一致性、隔离性、持久性）会比较重，而且横向扩展能力较差、功能单一，无法扛下所有数据量和流量，无法应对所有功能需求。因此，我们需要通过架构手段，来组合使用多种存储系统，取长补短，实现1+1&gt;2的效果。</p><p>我来举个例子。我们设计了一个<strong>包含多个数据库系统的、能应对各种高并发场景的一套数据服务的系统架构</strong>，其中包含了同步写服务、异步写服务和查询服务三部分，分别实现主数据库写入、辅助数据库写入和查询路由。</p><p>我们按照服务来依次分析下这个架构。</p><img src="https://static001.geekbang.org/resource/image/bb/38/bbbcdbd74308de6b8fda04b34ed07e38.png" alt=""><p>首先要明确的是，重要的业务主数据只能保存在MySQL这样的关系型数据库中，原因有三点：</p><ul><li>RDBMS经过了几十年的验证，已经非常成熟；</li><li>RDBMS的用户数量众多，Bug修复快、版本稳定、可靠性很高；</li><li>RDBMS强调ACID，能确保数据完整。</li></ul><p>有两种类型的查询任务可以交给MySQL来做，性能会比较好，这也是MySQL擅长的地方：</p><ul><li>按照主键ID的查询。直接查询聚簇索引，其性能会很高。但是单表数据量超过亿级后，性能也会衰退，而且单个数据库无法承受超大的查询并发，因此我们可以把数据表进行Sharding操作，均匀拆分到多个数据库实例中保存。我们把这套数据库集群称作Sharding集群。</li><li>按照各种条件进行范围查询，查出主键ID。对二级索引进行查询得到主键，只需要查询一棵B+树，效率同样很高。但索引的值不宜过大，比如对varchar(1000)进行索引不太合适，而索引外键（一般是int或bigint类型）性能就会比较好。因此，我们可以在MySQL中建立一张“索引表”，除了保存主键外，主要是保存各种关联表的外键，以及尽可能少的varchar类型的字段。这张索引表的大部分列都可以建上二级索引，用于进行简单搜索，搜索的结果是主键的列表，而不是完整的数据。由于索引表字段轻量并且数量不多（一般控制在10个以内），所以即便索引表没有进行Sharding拆分，问题也不会很大。</li></ul><p>如图上蓝色线所示，写入两种MySQL数据表和发送MQ消息的这三步，我们用一个<strong>同步写服务</strong>完成了。我在“<a href="https://time.geekbang.org/column/article/234928" target="_blank" rel="noopener noreferrer">异步处理</a>”中提到，所有异步流程都需要补偿，这里的异步流程同样需要。只不过为了简洁，我在这里省略了补偿流程。</p><p>然后，如图中绿色线所示，有一个<strong>异步写服务</strong>，监听MQ的消息，继续完成辅助数据的更新操作。这里我们选用了ES和InfluxDB这两种辅助数据库，因此整个异步写数据操作有三步：</p><ol><li>MQ消息不一定包含完整的数据，甚至可能只包含一个最新数据的主键ID，我们需要根据ID从查询服务查询到完整的数据。</li><li>写入InfluxDB的数据一般可以按时间间隔进行简单聚合，定时写入InfluxDB。因此，这里会进行简单的客户端聚合，然后写入InfluxDB。</li><li>ES不适合在各索引之间做连接（Join）操作，适合保存扁平化的数据。比如，我们可以把订单下的用户、商户、商品列表等信息，作为内嵌对象嵌入整个订单JSON，然后把整个扁平化的JSON直接存入ES。</li></ol><p>对于数据写入操作，我们认为操作返回的时候同步数据一定是写入成功的，但是由于各种原因，异步数据写入无法确保立即成功，会有一定延迟，比如：</p><ul><li>异步消息丢失的情况，需要补偿处理；</li><li>写入ES的索引操作本身就会比较慢；</li><li>写入InfluxDB的数据需要客户端定时聚合。</li></ul><p>因此，对于<strong>查询服务</strong>，如图中红色线所示，我们需要根据一定的上下文条件（比如查询一致性要求、时效性要求、搜索的条件、需要返回的数据字段、搜索时间区间等）来把请求路由到合适的数据库，并且做一些聚合处理：</p><ul><li>需要根据主键查询单条数据，可以从MySQL Sharding集群或Redis查询，如果对实时性要求不高也可以从ES查询。</li><li>按照多个条件搜索订单的场景，可以从MySQL索引表查询出主键列表，然后再根据主键从MySQL Sharding集群或Redis获取数据详情。</li><li>各种后台系统需要使用比较复杂的搜索条件，甚至全文搜索来查询订单数据，或是定时分析任务需要一次查询大量数据，这些场景对数据实时性要求都不高，可以到ES进行搜索。此外，MySQL中的数据可以归档，我们可以在ES中保留更久的数据，而且查询历史数据一般并发不会很大，可以统一路由到ES查询。</li><li>监控系统或后台报表系统需要呈现业务监控图表或表格，可以把请求路由到InfluxDB查询。</li></ul><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾"><span>重点回顾</span></a></h2><p>今天，我通过三个案例分别对比了缓存数据库Redis、时间序列数据库InfluxDB、搜索数据库ES和MySQL的性能。我们看到：</p><ul><li>Redis对单条数据的读取性能远远高于MySQL，但不适合进行范围搜索。</li><li>InfluxDB对于时间序列数据的聚合效率远远高于MySQL，但因为没有主键，所以不是一个通用数据库。</li><li>ES对关键字的全文搜索能力远远高于MySQL，但是字段的更新效率较低，不适合保存频繁更新的数据。</li></ul><p>最后，我们给出了一个混合使用MySQL + Redis + InfluxDB + ES的架构方案，充分发挥了各种数据库的特长，相互配合构成了一个可以应对各种复杂查询，以及高并发读写的存储架构。</p><ul><li>主数据由两种MySQL数据表构成，其中索引表承担简单条件的搜索来得到主键，Sharding表承担大并发的主键查询。主数据由同步写服务写入，写入后发出MQ消息。</li><li>辅助数据可以根据需求选用合适的NoSQL，由单独一个或多个异步写服务监听MQ后异步写入。</li><li>由统一的查询服务，对接所有查询需求，根据不同的查询需求路由查询到合适的存储，确保每一个存储系统可以根据场景发挥所长，并分散各数据库系统的查询压力。</li></ul><p>今天用到的代码，我都放在了GitHub上，你可以点击<a href="https://github.com/JosephZhu1983/java-common-mistakes" target="_blank" rel="noopener noreferrer">这个链接</a>查看。</p><h2 id="思考与讨论" tabindex="-1"><a class="header-anchor" href="#思考与讨论"><span>思考与讨论</span></a></h2><ol><li>我们提到，InfluxDB不能包含太多tag。你能写一段测试代码，来模拟这个问题，并观察下InfluxDB的内存使用情况吗？</li><li>文档数据库MongoDB，也是一种常用的NoSQL。你觉得MongoDB的优势和劣势是什么呢？它适合用在什么场景下呢？</li></ol><p>关于数据存储，你还有其他心得吗？我是朱晔，欢迎在评论区与我留言分享你的想法，也欢迎你把今天的内容分享给你的朋友或同事，一起交流。</p>`,95)]))}const c=s(l,[["render",p]]),m=JSON.parse('{"path":"/posts/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/%E8%AE%BE%E8%AE%A1%E7%AF%87/26%20_%20%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8%EF%BC%9ANoSQL%E4%B8%8ERDBMS%E5%A6%82%E4%BD%95%E5%8F%96%E9%95%BF%E8%A1%A5%E7%9F%AD%E3%80%81%E7%9B%B8%E8%BE%85%E7%9B%B8%E6%88%90%EF%BC%9F.html","title":"","lang":"zh-CN","frontmatter":{"description":"你好，我是朱晔。今天，我来和你聊聊数据存储的常见错误。 近几年，各种非关系型数据库，也就是NoSQL发展迅猛，在项目中也非常常见。其中不乏一些使用上的极端情况，比如直接把关系型数据库（RDBMS）全部替换为NoSQL，或是在不合适的场景下错误地使用NoSQL。 其实，每种NoSQL的特点不同，都有其要着重解决的某一方面的问题。因此，我们在使用NoSQL...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E4%B8%9A%E5%8A%A1%E5%BC%80%E5%8F%91%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF100%E4%BE%8B/%E8%AE%BE%E8%AE%A1%E7%AF%87/26%20_%20%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8%EF%BC%9ANoSQL%E4%B8%8ERDBMS%E5%A6%82%E4%BD%95%E5%8F%96%E9%95%BF%E8%A1%A5%E7%9F%AD%E3%80%81%E7%9B%B8%E8%BE%85%E7%9B%B8%E6%88%90%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:description","content":"你好，我是朱晔。今天，我来和你聊聊数据存储的常见错误。 近几年，各种非关系型数据库，也就是NoSQL发展迅猛，在项目中也非常常见。其中不乏一些使用上的极端情况，比如直接把关系型数据库（RDBMS）全部替换为NoSQL，或是在不合适的场景下错误地使用NoSQL。 其实，每种NoSQL的特点不同，都有其要着重解决的某一方面的问题。因此，我们在使用NoSQL..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:00:11.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:00:11.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:00:11.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743411611000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":1}]},"readingTime":{"minutes":24.19,"words":7257},"filePathRelative":"posts/Java业务开发常见错误100例/设计篇/26 _ 数据存储：NoSQL与RDBMS如何取长补短、相辅相成？.md","localizedDate":"2025年3月31日","excerpt":"<p><audio id=\\"audio\\" title=\\"26 | 数据存储：NoSQL与RDBMS如何取长补短、相辅相成？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/99/74/99d6bb4b14d87138e87148d987122274.mp3\\"></audio></p>\\n<p>你好，我是朱晔。今天，我来和你聊聊数据存储的常见错误。</p>\\n<p>近几年，各种非关系型数据库，也就是NoSQL发展迅猛，在项目中也非常常见。其中不乏一些使用上的极端情况，比如直接把关系型数据库（RDBMS）全部替换为NoSQL，或是在不合适的场景下错误地使用NoSQL。</p>","autoDesc":true}');export{c as comp,m as data};
