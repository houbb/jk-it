import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-CrA-f6So.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="_31-装饰器模式-如何优化电商系统中复杂的商品价格策略" tabindex="-1"><a class="header-anchor" href="#_31-装饰器模式-如何优化电商系统中复杂的商品价格策略"><span>31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？</span></a></h1><p><audio id="audio" title="31 | 装饰器模式：如何优化电商系统中复杂的商品价格策略？" controls="" preload="none"><source id="mp3" src="https://static001.geekbang.org/resource/audio/fb/7e/fb48248bfb9c075ce52914582bcba07e.mp3"></audio></p><p>你好，我是刘超。</p><p>开始今天的学习之前，我想先请你思考一个问题。假设现在有这样一个需求，让你设计一个装修功能，用户可以动态选择不同的装修功能来装饰自己的房子。例如，水电装修、天花板以及粉刷墙等属于基本功能，而设计窗帘装饰窗户、设计吊顶装饰房顶等未必是所有用户都需要的，这些功能则需要实现动态添加。还有就是一旦有新的装修功能，我们也可以实现动态添加。如果要你来负责，你会怎么设计呢？</p><p>此时你可能会想了，通常给一个对象添加功能，要么直接修改代码，在对象中添加相应的功能，要么派生对应的子类来扩展。然而，前者每次都需要修改对象的代码，这显然不是理想的面向对象设计，即便后者是通过派生对应的子类来扩展，也很难满足复杂的随意组合功能需求。</p><p>面对这种情况，使用装饰器模式应该再合适不过了。它的优势我想你多少知道一点，我在这里总结一下。</p><p>装饰器模式能够实现为对象动态添加装修功能，它是从一个对象的外部来给对象添加功能，所以有非常灵活的扩展性，我们可以在对原来的代码毫无修改的前提下，为对象添加新功能。除此之外，装饰器模式还能够实现对象的动态组合，借此我们可以很灵活地给动态组合的对象，匹配所需要的功能。</p><p>下面我们就通过实践，具体看看该模式的优势。</p><h2 id="什么是装饰器模式" tabindex="-1"><a class="header-anchor" href="#什么是装饰器模式"><span>什么是装饰器模式？</span></a></h2><p>在这之前，我先简单介绍下什么是装饰器模式。装饰器模式包括了以下几个角色：接口、具体对象、装饰类、具体装饰类。</p><p>接口定义了具体对象的一些实现方法；具体对象定义了一些初始化操作，比如开头设计装修功能的案例中，水电装修、天花板以及粉刷墙等都是初始化操作；装饰类则是一个抽象类，主要用来初始化具体对象的一个类；其它的具体装饰类都继承了该抽象类。</p><p>下面我们就通过装饰器模式来实现下装修功能，代码如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 定义一个基本装修接口</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IDecorator {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 装修方法</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	void decorate();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 装修基本类</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Decorator implements IDecorator{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 基本实现方法</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void decorate() {</span></span>
<span class="line"><span>		System.out.println(&amp;quot;水电装修、天花板以及粉刷墙。。。&amp;quot;);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 基本装饰类</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public abstract class BaseDecorator implements IDecorator{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private IDecorator decorator;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public BaseDecorator(IDecorator decorator) {</span></span>
<span class="line"><span>		this.decorator = decorator;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 调用装饰方法</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	public void decorate() {</span></span>
<span class="line"><span>		if(decorator != null) {</span></span>
<span class="line"><span>			decorator.decorate();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 窗帘装饰类</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class CurtainDecorator extends BaseDecorator{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public CurtainDecorator(IDecorator decorator) {</span></span>
<span class="line"><span>		super(decorator);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 窗帘具体装饰方法</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	@Override</span></span>
<span class="line"><span>	public void decorate() {</span></span>
<span class="line"><span>		System.out.println(&amp;quot;窗帘装饰。。。&amp;quot;);</span></span>
<span class="line"><span>		super.decorate();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>    public static void main( String[] args )</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    	IDecorator decorator = new Decorator();</span></span>
<span class="line"><span>    	IDecorator curtainDecorator = new CurtainDecorator(decorator);</span></span>
<span class="line"><span>    	curtainDecorator.decorate();</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>窗帘装饰。。。</span></span>
<span class="line"><span>水电装修、天花板以及粉刷墙。。。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>通过这个案例，我们可以了解到：如果我们想要在基础类上添加新的装修功能，只需要基于抽象类BaseDecorator去实现继承类，通过构造函数调用父类，以及重写装修方法实现装修窗帘的功能即可。在main函数中，我们通过实例化装饰类，调用装修方法，即可在基础装修的前提下，获得窗帘装修功能。</p><p>基于装饰器模式实现的装修功能的代码结构简洁易读，业务逻辑也非常清晰，并且如果我们需要扩展新的装修功能，只需要新增一个继承了抽象装饰类的子类即可。</p><p>在这个案例中，我们仅实现了业务扩展功能，接下来，我将通过装饰器模式优化电商系统中的商品价格策略，实现不同促销活动的灵活组合。</p><h2 id="优化电商系统中的商品价格策略" tabindex="-1"><a class="header-anchor" href="#优化电商系统中的商品价格策略"><span>优化电商系统中的商品价格策略</span></a></h2><p>相信你一定不陌生，购买商品时经常会用到的限时折扣、红包、抵扣券以及特殊抵扣金等，种类很多，如果换到开发视角，实现起来就更复杂了。</p><p>例如，每逢双十一，为了加大商城的优惠力度，开发往往要设计红包+限时折扣或红包+抵扣券等组合来实现多重优惠。而在平时，由于某些特殊原因，商家还会赠送特殊抵扣券给购买用户，而特殊抵扣券+各种优惠又是另一种组合方式。</p><p>要实现以上这类组合优惠的功能，最快、最普遍的实现方式就是通过大量if-else的方式来实现。但这种方式包含了大量的逻辑判断，致使其他开发人员很难读懂业务， 并且一旦有新的优惠策略或者价格组合策略出现，就需要修改代码逻辑。</p><p>这时，刚刚介绍的装饰器模式就很适合用在这里，其相互独立、自由组合以及方便动态扩展功能的特性，可以很好地解决if-else方式的弊端。下面我们就用装饰器模式动手实现一套商品价格策略的优化方案。</p><p>首先，我们先建立订单和商品的属性类，在本次案例中，为了保证简洁性，我只建立了几个关键字段。以下几个重要属性关系为，主订单包含若干详细订单，详细订单中记录了商品信息，商品信息中包含了促销类型信息，一个商品可以包含多个促销类型（本案例只讨论单个促销和组合促销）：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 主订单</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Order {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private int id; //订单ID</span></span>
<span class="line"><span>	private String orderNo; //订单号</span></span>
<span class="line"><span>	private BigDecimal totalPayMoney; //总支付金额</span></span>
<span class="line"><span>	private List&amp;lt;OrderDetail&amp;gt; list; //详细订单列表</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 详细订单</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class OrderDetail {</span></span>
<span class="line"><span>	private int id; //详细订单ID</span></span>
<span class="line"><span>	private int orderId;//主订单ID</span></span>
<span class="line"><span>	private Merchandise merchandise; //商品详情</span></span>
<span class="line"><span>	private BigDecimal payMoney; //支付单价</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 商品</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Merchandise {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private String sku;//商品SKU</span></span>
<span class="line"><span>	private String name; //商品名称</span></span>
<span class="line"><span>	private BigDecimal price; //商品单价</span></span>
<span class="line"><span>	private Map&amp;lt;PromotionType, SupportPromotions&amp;gt; supportPromotions; //支持促销类型</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 促销类型</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class SupportPromotions implements Cloneable{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private int id;//该商品促销的ID</span></span>
<span class="line"><span>	private PromotionType promotionType;//促销类型 1\\优惠券 2\\红包</span></span>
<span class="line"><span>	private int priority; //优先级</span></span>
<span class="line"><span>	private UserCoupon userCoupon; //用户领取该商品的优惠券</span></span>
<span class="line"><span>	private UserRedPacket userRedPacket; //用户领取该商品的红包</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	//重写clone方法</span></span>
<span class="line"><span>    public SupportPromotions clone(){</span></span>
<span class="line"><span>    	SupportPromotions supportPromotions = null;</span></span>
<span class="line"><span>        try{</span></span>
<span class="line"><span>        	supportPromotions = (SupportPromotions)super.clone();</span></span>
<span class="line"><span>        }catch(CloneNotSupportedException e){</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return supportPromotions;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 优惠券</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserCoupon {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private int id; //优惠券ID</span></span>
<span class="line"><span>	private int userId; //领取优惠券用户ID</span></span>
<span class="line"><span>	private String sku; //商品SKU</span></span>
<span class="line"><span>	private BigDecimal coupon; //优惠金额</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 红包</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class UserRedPacket {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	private int id; //红包ID</span></span>
<span class="line"><span>	private int userId; //领取用户ID</span></span>
<span class="line"><span>	private String sku; //商品SKU</span></span>
<span class="line"><span>	private BigDecimal redPacket; //领取红包金额</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，我们再建立一个计算支付金额的接口类以及基本类：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 计算支付金额接口类</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public interface IBaseCount {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	BigDecimal countPayMoney(OrderDetail orderDetail);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 支付基本类</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class BaseCount implements IBaseCount{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public BigDecimal countPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>orderDetail.setPayMoney(orderDetail.getMerchandise().getPrice());</span></span>
<span class="line"><span>		System.out.println(&amp;quot;商品原单价金额为：&amp;quot; +  orderDetail.getPayMoney());</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		return orderDetail.getPayMoney();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们再建立一个计算支付金额的抽象类，由抽象类调用基本类：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 计算支付金额的抽象类</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public abstract class BaseCountDecorator implements IBaseCount{</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private IBaseCount count;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public BaseCountDecorator(IBaseCount count) {</span></span>
<span class="line"><span>		this.count = count;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public BigDecimal countPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>		BigDecimal payTotalMoney = new BigDecimal(0);</span></span>
<span class="line"><span>		if(count!=null) {</span></span>
<span class="line"><span>			payTotalMoney = count.countPayMoney(orderDetail);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return payTotalMoney;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们再通过继承抽象类来实现我们所需要的修饰类（优惠券计算类、红包计算类）：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 计算使用优惠券后的金额</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class CouponDecorator extends BaseCountDecorator{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public CouponDecorator(IBaseCount count) {</span></span>
<span class="line"><span>		super(count);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public BigDecimal countPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>		BigDecimal payTotalMoney = new BigDecimal(0);</span></span>
<span class="line"><span>		payTotalMoney = super.countPayMoney(orderDetail);</span></span>
<span class="line"><span>		payTotalMoney = countCouponPayMoney(orderDetail);</span></span>
<span class="line"><span>		return payTotalMoney;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private BigDecimal countCouponPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		BigDecimal coupon =  orderDetail.getMerchandise().getSupportPromotions().get(PromotionType.COUPON).getUserCoupon().getCoupon();</span></span>
<span class="line"><span>		System.out.println(&amp;quot;优惠券金额：&amp;quot; + coupon);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		orderDetail.setPayMoney(orderDetail.getPayMoney().subtract(coupon));</span></span>
<span class="line"><span>		return orderDetail.getPayMoney();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 计算使用红包后的金额</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class RedPacketDecorator extends BaseCountDecorator{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	public RedPacketDecorator(IBaseCount count) {</span></span>
<span class="line"><span>		super(count);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public BigDecimal countPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>		BigDecimal payTotalMoney = new BigDecimal(0);</span></span>
<span class="line"><span>		payTotalMoney = super.countPayMoney(orderDetail);</span></span>
<span class="line"><span>		payTotalMoney = countCouponPayMoney(orderDetail);</span></span>
<span class="line"><span>		return payTotalMoney;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	private BigDecimal countCouponPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		BigDecimal redPacket = orderDetail.getMerchandise().getSupportPromotions().get(PromotionType.REDPACKED).getUserRedPacket().getRedPacket();</span></span>
<span class="line"><span>		System.out.println(&amp;quot;红包优惠金额：&amp;quot; + redPacket);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		orderDetail.setPayMoney(orderDetail.getPayMoney().subtract(redPacket));</span></span>
<span class="line"><span>		return orderDetail.getPayMoney();</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后，我们通过一个工厂类来组合商品的促销类型：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 计算促销后的支付价格</span></span>
<span class="line"><span> * @author admin</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class PromotionFactory {</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public static BigDecimal getPayMoney(OrderDetail orderDetail) {</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		//获取给商品设定的促销类型</span></span>
<span class="line"><span>		Map&amp;lt;PromotionType, SupportPromotions&amp;gt; supportPromotionslist = orderDetail.getMerchandise().getSupportPromotions();</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		//初始化计算类</span></span>
<span class="line"><span>		IBaseCount baseCount = new BaseCount();</span></span>
<span class="line"><span>		if(supportPromotionslist!=null &amp;amp;&amp;amp; supportPromotionslist.size()&amp;gt;0) {</span></span>
<span class="line"><span>			for(PromotionType promotionType: supportPromotionslist.keySet()) {//遍历设置的促销类型，通过装饰器组合促销类型</span></span>
<span class="line"><span>				baseCount = protmotion(supportPromotionslist.get(promotionType), baseCount);</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return baseCount.countPayMoney(orderDetail);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * 组合促销类型</span></span>
<span class="line"><span>	 * @param supportPromotions</span></span>
<span class="line"><span>	 * @param baseCount</span></span>
<span class="line"><span>	 * @return</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private static IBaseCount protmotion(SupportPromotions supportPromotions, IBaseCount baseCount) {</span></span>
<span class="line"><span>		if(supportPromotions.getPromotionType()==PromotionType.COUPON) {</span></span>
<span class="line"><span>			baseCount = new CouponDecorator(baseCount);</span></span>
<span class="line"><span>		}else if(supportPromotions.getPromotionType()==PromotionType.REDPACKED) {</span></span>
<span class="line"><span>			baseCount = new RedPacketDecorator(baseCount);</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>		return baseCount;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>    public static void main( String[] args ) throws InterruptedException, IOException</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>    	Order order = new Order();</span></span>
<span class="line"><span>    	init(order);</span></span>
<span class="line"><span>    	</span></span>
<span class="line"><span>    	for(OrderDetail orderDetail: order.getList()) {</span></span>
<span class="line"><span>    		BigDecimal payMoney = PromotionFactory.getPayMoney(orderDetail);</span></span>
<span class="line"><span>    		orderDetail.setPayMoney(payMoney);</span></span>
<span class="line"><span>    		System.out.println(&amp;quot;最终支付金额：&amp;quot; + orderDetail.getPayMoney());</span></span>
<span class="line"><span>    	}</span></span>
<span class="line"><span>    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>商品原单价金额为：20</span></span>
<span class="line"><span>优惠券金额：3</span></span>
<span class="line"><span>红包优惠金额：10</span></span>
<span class="line"><span>最终支付金额：7</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上源码可以通过 <a href="https://github.com/nickliuchao/decorator.git" target="_blank" rel="noopener noreferrer">Github</a> 下载运行。通过以上案例可知：使用装饰器模式设计的价格优惠策略，实现各个促销类型的计算功能都是相互独立的类，并且可以通过工厂类自由组合各种促销类型。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>这讲介绍的装饰器模式主要用来优化业务的复杂度，它不仅简化了我们的业务代码，还优化了业务代码的结构设计，使得整个业务逻辑清晰、易读易懂。</p><p>通常，装饰器模式用于扩展一个类的功能，且支持动态添加和删除类的功能。在装饰器模式中，装饰类和被装饰类都只关心自身的业务，不相互干扰，真正实现了解耦。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题"><span>思考题</span></a></h2><p>责任链模式、策略模式与装饰器模式有很多相似之处。平时，这些设计模式除了在业务中被用到以外，在架构设计中也经常被用到，你是否在源码中见过这几种设计模式的使用场景呢？欢迎你与大家分享。</p>`,53)]))}const c=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/%E6%A8%A1%E5%9D%97%E4%BA%94%20%C2%B7%20%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E8%B0%83%E4%BC%98/31%20_%20%E8%A3%85%E9%A5%B0%E5%99%A8%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96%E7%94%B5%E5%95%86%E7%B3%BB%E7%BB%9F%E4%B8%AD%E5%A4%8D%E6%9D%82%E7%9A%84%E5%95%86%E5%93%81%E4%BB%B7%E6%A0%BC%E7%AD%96%E7%95%A5%EF%BC%9F.html","title":"31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？","lang":"zh-CN","frontmatter":{"description":"31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？ 你好，我是刘超。 开始今天的学习之前，我想先请你思考一个问题。假设现在有这样一个需求，让你设计一个装修功能，用户可以动态选择不同的装修功能来装饰自己的房子。例如，水电装修、天花板以及粉刷墙等属于基本功能，而设计窗帘装饰窗户、设计吊顶装饰房顶等未必是所有用户都需要的，这些功能则需要实现动态添加...","head":[["meta",{"property":"og:url","content":"https://houbb.github.io/jk-it/posts/Java%E6%80%A7%E8%83%BD%E8%B0%83%E4%BC%98%E5%AE%9E%E6%88%98/%E6%A8%A1%E5%9D%97%E4%BA%94%20%C2%B7%20%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E8%B0%83%E4%BC%98/31%20_%20%E8%A3%85%E9%A5%B0%E5%99%A8%E6%A8%A1%E5%BC%8F%EF%BC%9A%E5%A6%82%E4%BD%95%E4%BC%98%E5%8C%96%E7%94%B5%E5%95%86%E7%B3%BB%E7%BB%9F%E4%B8%AD%E5%A4%8D%E6%9D%82%E7%9A%84%E5%95%86%E5%93%81%E4%BB%B7%E6%A0%BC%E7%AD%96%E7%95%A5%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"老马啸西风"}],["meta",{"property":"og:title","content":"31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？"}],["meta",{"property":"og:description","content":"31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？ 你好，我是刘超。 开始今天的学习之前，我想先请你思考一个问题。假设现在有这样一个需求，让你设计一个装修功能，用户可以动态选择不同的装修功能来装饰自己的房子。例如，水电装修、天花板以及粉刷墙等属于基本功能，而设计窗帘装饰窗户、设计吊顶装饰房顶等未必是所有用户都需要的，这些功能则需要实现动态添加..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-31T09:30:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-31T09:30:23.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-31T09:30:23.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"老马啸西风\\",\\"url\\":\\"https://houbb.github.io\\"}]}"]]},"git":{"createdTime":1743411611000,"updatedTime":1743413423000,"contributors":[{"name":"binbin.hou","username":"","email":"binbin.hou@huifu.com","commits":2}]},"readingTime":{"minutes":9.25,"words":2775},"filePathRelative":"posts/Java性能调优实战/模块五 · 设计模式调优/31 _ 装饰器模式：如何优化电商系统中复杂的商品价格策略？.md","localizedDate":"2025年3月31日","excerpt":"\\n<p><audio id=\\"audio\\" title=\\"31 | 装饰器模式：如何优化电商系统中复杂的商品价格策略？\\" controls=\\"\\" preload=\\"none\\"><source id=\\"mp3\\" src=\\"https://static001.geekbang.org/resource/audio/fb/7e/fb48248bfb9c075ce52914582bcba07e.mp3\\"></audio></p>\\n<p>你好，我是刘超。</p>\\n<p>开始今天的学习之前，我想先请你思考一个问题。假设现在有这样一个需求，让你设计一个装修功能，用户可以动态选择不同的装修功能来装饰自己的房子。例如，水电装修、天花板以及粉刷墙等属于基本功能，而设计窗帘装饰窗户、设计吊顶装饰房顶等未必是所有用户都需要的，这些功能则需要实现动态添加。还有就是一旦有新的装修功能，我们也可以实现动态添加。如果要你来负责，你会怎么设计呢？</p>","autoDesc":true}');export{c as comp,v as data};
