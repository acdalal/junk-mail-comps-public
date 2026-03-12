/*all item data, including images, category, and product details
all items appear at first when the "all" category is selected by default */
export interface Product {
  name: string;
  image: any;
  category: string;
  specs: string[];
  alt: string;
}

export const itemsData: Product[] = [
    {
      name: "Yellow Thin Pad",
      image: require("@/assets/images/yellowthin.png"),
      category: "Menstrual",
      alt: "Always Size 1 Regular Ultra Thin menstrual pad in yellow package",
      specs: ["Size 1 Regular", "Ultra Thin", "8 hours protection", "Brand: Always"] 
    },
    {
      name: "Green Thin Pad",
      image: require("@/assets/images/greenthin.png"),
      category: "Menstrual",
      alt: "Always Size 2 Super Long Ultra Thin menstrual pad in green package",
      specs: ["Size 2 Super Long", "Ultra Thin", "8 hours protection", "Brand: Always"]
    },
    {
      name: "Orange Thin Pad",
      image: require("@/assets/images/orangethin.png"),
      category: "Menstrual",
      alt: "Always Size 4 Overnight Ultra Thin menstrual pad in orange package",
      specs: ["Size 4 Overnight", "Ultra Thin", "11 hours protection", "Brand: Always"]
    },
    {
      name: "Green Maxi Pad",
      image: require("@/assets/images/greenmaxi.png"),
      category: "Menstrual",
      alt: "Always Size 2 Super Long Maxi menstrual pad in green package",
      specs: ["Size 2 Super Long", "Thicker pad and feeling of extra security", "10 hours protection", "Brand: Always"]
    },
    {
      name: "Purple Maxi Pad",
      image: require("@/assets/images/purplemaxi.png"),
      category: "Menstrual",
      alt: "Always Size 5 Extra Heavy Overnight Maxi menstrual pad in purple package",
      specs: ["Size 5 Extra Heavy Overnight", "Thicker pad and feeling of extra security", "12 hours protection", "Brand: Always"]
    },
    {
      name: "Purple Thin Pad",
      image: require("@/assets/images/purplethin.png"),
      category: "Menstrual",
      alt: "Always Size 5 Extra Heavy Overnight Ultra Thin menstrual pad in purple package",
      specs: ["Size 5 Extra Heavy Overnight", "Ultra Thin", "12 hours protection", "Brand: Always"]
    },
    {
      name: "Light Tampon",
      image: require("@/assets/images/lighttampon.png"),
      category: "Menstrual",
       alt: "Tampax Pearl Light flow tampons box",
      specs: ["Light flow", "8 hours wear time", "Brand: Tampax Pearl"]
    },
    {
      name: "Regular Tampon",
      image: require("@/assets/images/regulartampon.png"),
      category: "Menstrual",
      alt: "Tampax Pearl Regular flow tampons box",
      specs: ["Regular flow", "8 hours wear time", "Brand: Tampax Pearl"]
    },
    {
      name: "Super Tampon",
      image: require("@/assets/images/supertampon.png"),
      category: "Menstrual",
      alt: "Tampax Pearl Super flow tampons box",
      specs: ["Heavier flow" , "8 hours wear time", "Brand: Tampax Pearl"]
    },
    {
      name: "Menstrual Disc",
      image: require("@/assets/images/menstrualdisc.png"),
      category: "Menstrual",
      alt: "allMatters reusable menstrual disc",
      specs: ["Reusable", "12 hours wear time", "Includes info card","Disc-shaped device that collections blood", "sits below vaginal fornix, secured by pubic bone", "One size fits all", "Brand: allMatters", "Limit: 1 per year", "[Menstrual Disc Info](https://allmatters.com/en-us/blogs/blog/how-to-use-a-menstrual-disc)"]
    },
    {
      name: "Menstrual Cup (Mini)",
      image: require("@/assets/images/menstrualcup.png"),
      category: "Menstrual",
      alt: "allMatters reusable menstrual cup, size Mini",
      specs: ["Size Mini: Lighter flow/low cervix/prefer smaller size ", "Includes info card", "Reusable", "12 hours wear time", "For lighter flow/low cervix/prefer smaller size", "Creates gentle seal and vaginal canal", "Tail for removal", "Limit: 1 per year", "[Menstrual Cup Size Guide](https://allmatters.com/en-us/pages/cup-size-guide)"]
    },
    {
      name: "Menstrual Cup (A)",
      image: require("@/assets/images/menstrualcup.png"),
      category: "Menstrual",
      alt: "allMatters reusable menstrual cup, size A",
      specs: ["Size A: Haven't given birth vaginally/medium to high cervix ","Includes info card", "Reusable", "12 hours wear time", "Creates gentle seal and vaginal canal", "Tail for removal", "Limit: 1 per year", "[Menstrual Cup Size Guide](https://allmatters.com/en-us/pages/cup-size-guide)"]
    },

    {
      name: "Lubed Reg Condom",
      image: require("@/assets/images/lubecondom.png"),
      category: "Safer Sex",
      alt: "Trojan ENZ lubricated regular size latex condoms",
      specs: ["Lubricated", "Size: Regular", "Contains latex", "Brand: Trojan ENZ", "Suitable for oral, vaginal, and anal sex,", "[Choosing the best condom for you](https://www.bedsider.org/birth-control/condom)"]
    },
    {
      name: "Non-Lubed Reg Condom",
      image: require("@/assets/images/nonlubecondom.png"),
      category: "Safer Sex",
      alt: "LifeStyles non-lubricated regular size latex condoms",
      specs: ["Non-lubricated", "Size: Regular", "Contains latex", "Brand: LifeStyles", "Suitable for oral, vaginal, and anal sex,", "[Choosing the best condom for you](https://www.bedsider.org/birth-control/condom)"]
    },
    {
      name: "Latex-free Condom",
      image: require("@/assets/images/latexfreecondom.png"),
      category: "Safer Sex",
      alt: "SKYN latex-free polyisoprene condoms",
      specs: ["Lubricated", "Latex-free: Polyisoprene material", "Brand: SKYN","Suitable for oral, vaginal, and anal sex,", "[Choosing the best condom for you](https://www.bedsider.org/birth-control/condom)"]
    },
    {
      name: "Magnum Condom",
      image: require("@/assets/images/magnumcondom.png"),
      category: "Safer Sex",
      alt: "Trojan Magnum large size lubricated latex condoms",
      specs: ["Lubricated", "Size: Large", "Contains latex", "Brand: Trojan Magnum","Suitable for oral, vaginal, and anal sex,", "[Choosing the best condom for you](https://www.bedsider.org/birth-control/condom)"]
    },
    {
      name: "Internal Condom",
      image: require("@/assets/images/internalcondom.png"),
      category: "Safer Sex",
      alt: "FC2 latex-free nitrile internal condom",
      specs: ["Use within vagina or anus during sex", "Latex-free", "Nitrile material", "Brand: FC2"]
    },
    {
      name: "Strawberry Dental Dam",
      image: require("@/assets/images/scenteddentaldam.png"),
      category: "Safer Sex",
      alt: "Satin scented latex dental dams in strawberry flavor",
      specs: ["Covers vagina or anus during oral sex","Scent: Strawberry", "Contains latex", "Brand: Satin", "[Dental Dam Info](https://my.clevelandclinic.org/health/drugs/22887-dental-dam)"]
    },
    {
      name: "Vanilla Dental Dam",
      image: require("@/assets/images/scenteddentaldam.png"),
      category: "Safer Sex",
      alt: "Satin scented latex dental dams in vanilla flavor",
      specs: ["Covers vagina or anus during oral sex","Scent: Vanilla", "Contains latex", "Brand: Satin", "[Dental Dam Info](https://my.clevelandclinic.org/health/drugs/22887-dental-dam)"]
    },
    {
      name: "Spearmint Dental Dam",
      image: require("@/assets/images/scenteddentaldam.png"),
      category: "Safer Sex",
      alt: "Satin scented latex dental dams in spearmint flavor",
      specs: ["Covers vagina or anus during oral sex","Scent: Spearmint", "Contains latex", "Brand: Satin", "[Dental Dam Info](https://my.clevelandclinic.org/health/drugs/22887-dental-dam)"]
    },
    {
      name: "Grape Dental Dam",
      image: require("@/assets/images/scenteddentaldam.png"),
      category: "Safer Sex",
      alt: "Satin scented latex dental dams in grape flavor",
      specs: ["Covers vagina or anus during oral sex","Scent: Grape", "Contains latex", "Brand: Satin", "[Dental Dam Info](https://my.clevelandclinic.org/health/drugs/22887-dental-dam)"]
    },
    {
      name: "Unscented Dental Dam",
      image: require("@/assets/images/dentaldam.png"),
      category: "Safer Sex",
      alt: "Harmony unscented latex-free polyisoprene dental dam",
      specs: ["Covers vagina or anus during oral sex","Unscented", "Latex-free", "Polyisoprene material", "Brand: Harmony", "[Dental Dam Info](https://my.clevelandclinic.org/health/drugs/22887-dental-dam)"]
    },
    {
      name: "Lubricant",
      image: require("@/assets/images/lubricant.png"),
      category: "Safer Sex",
      alt: "Oasis water-based lubricant packet",
      specs: ["Water-based", "Packet", "Use on skin or condom", "Brand: Oasis"]
    },

    {
      name: "Pregnancy Test",
      image: require("@/assets/images/pregtest.png"),
      category: "Emergency Contraception",
      alt: "Pregmate at-home pregnancy test kit",
      specs: ["Over 99% accurate after missed period", "Results in minutes", "Detects hCG hormone in your urine", "easy-to-use at-home test", "Brand: Pregmate"]
    },
    {
      name: "Plan B",
      image: require("@/assets/images/planb.png"),
      category: "Emergency Contraception",
      alt: "Plan B One-Step emergency contraceptive pill package",
      specs: ["Reduce chance of pregnancy after unprotected sex", "Take within 72 hours", "Weight limit: 165 lbs", "Contains levonorgestrel: hormone that prevents ovulation/fertilization", "Not a replacement for missed birth control pill", "Does not effect existing pregnancy or harm developing embreyo", "Brand: Plan B One-Step", ]
    },
  ];

export const itemLimits: { [key: string]: number } = {
  "Menstrual Cup (Mini)": 1,
  "Menstrual Cup (A)": 1,
  "Menstrual Disc": 1,
  "Plan B": 3,
};

export const DEFAULT_LIMIT = 10;