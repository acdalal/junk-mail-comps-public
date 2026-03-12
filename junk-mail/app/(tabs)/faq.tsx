import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
  Linking,
} from "react-native";

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { faqStyles } from "@/components/ui/faq-styles";
import { Title } from "@/components/ui/title";

/* This is the FAQ page. Users can look at a few common questions about 
   the Junk Mail program to learn more about it. */

export default function ProductInfoScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const faq = [
    {
      Q: "How can I use the Junk Mail App?",
      A: "This app includes the following features:",
      bulletPoints: [
        "Ability to place a Junk Mail Order",
        "Information and photos for all sexual health products (info button for each product)",
        "Optional delivery notifications (change preferences on settings page) ",
        "Optional reminders to place an order (change preferences on settings page)",
        "Optional order history page (change preferences on settings page)",
        "Easy re-ordering of previously placed orders",
      ]
    },
    {
      Q: "How does the Junk Mail delivery system work?",
      A: "Junk Mail kits are delivered to campus mailboxes on Friday afternoon each week (see button below). NOTE: During the Summer, Junk Mail is delivered on Wednesdays instead. Kits will be delivered in a discreet brown paper bag with only your name and mailbox number on it. Students are limited to ONE request per week. NOTE: Your name and info is kept private and only seen by the Office of Health Promotion and the SWA's."
    },
    {
      Q: "What can I order?",
      A: "OHP offers the following supplies for Junk Mail:",
      bulletPoints: [
        "Internal condoms & External condoms",
        "Oral Dams",
        "Lube",
        "Tampons",
        "Pads",
        "Menstrual Cups",
        "Emergency Contraception",
        "Pregnancy Tests",
        "All packages also feature educational materials."
      ]
    },
    {
      Q: "How soon will I recieve my order?",
      A: "Junk Mail are mailed once a week on Fridays (or Wednesdays if during the Summer). The deadline to request each week's delivery is by Thursday @ Noon (12pm). NOTE: During the Summer, the deadline is Tuesday @ 5pm."
    },
    {
      Q: "Are there other places on campus where I can get safer sex supplies for free?",
      A: "Yes! Below are other options where you can get safer sex supplies in person. As well as menstrual supply stations in 6 all-gender restroom locations on campus. ",
      bulletPoints: [
        "Office of Health Promotion (OHP) - Sayles 162 (24/7 Access, outside of office)",
        "Student Health and Counseling (SHAC) (during business hours)",
        "Gender and Sexuality Center (GSC) (during business hours)",
        "Weitz 55 (urgent/emergency needs)",
        "Rec Center 225A (urgent/emergency needs)",
        "Library 435 (urgent/emergency needs)",
        "Severence 105 (urgent/emergency needs)",
        "Anderson Hall 146 (urgent/emergency needs)",
        "Willis 125 (urgent/emergency needs)"]
    },
    {
      Q: "Where can I find more resources related to sexual-health on campus?",
      A: "Here are some helpful resources:",
      links: [
        {
          text: "Junk Mail Program",
          url: "https://www.carleton.edu/health-promotion/sexual-well-being/junk-mail/"
        },
        {
          text: "OHP Sexual Well-Being",
          url: "https://www.carleton.edu/health-promotion/sexual-well-being/"
        },
        {
          text: "SHAC",
          url: "https://www.carleton.edu/student-health/"
        }
      ]
    }
  ];
  
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View 
      style={{ flex: 1, backgroundColor: colors.background }}
      accessible={false}
    >
      <Title>FAQ</Title>

      <ScrollView
        style={faqStyles.scrollView}
        contentContainerStyle={faqStyles.contentContainer}
        showsVerticalScrollIndicator={false}
        accessible={false}
      >
        {faq.map((faq, index) => (
          <View 
            key={index} 
            style={faqStyles.faqItem}
            accessible={false}
          >
            <Pressable
              style={[
                faqStyles.questionContainer,
                { backgroundColor: colors.buttonBackground }
              ]}
              onPress={() => toggleExpand(index)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`FAQ question ${index + 1}: ${faq.Q}`}
              accessibilityHint={expandedIndex === index ? "Double tap to collapse answer" : "Double tap to expand answer"}
              accessibilityState={{ expanded: expandedIndex === index }}
            >
              <Text 
                style={[faqStyles.questionText, { color: colors.buttonText }]}
                accessible={false}
              >
                {faq.Q}
              </Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={24}
                color={colors.buttonText}
                accessible={false}
              />
            </Pressable>

            {expandedIndex === index && (
              <View 
                style={faqStyles.answerContainer}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Answer: ${faq.A}${faq.bulletPoints ? '. Includes a list of items.' : ''}`}
              >
                <Text style={faqStyles.answerText}>{faq.A}</Text>
                {faq.bulletPoints && (
                  <View 
                    style={faqStyles.bulletContainer}
                    accessible={false}
                  >
                    {faq.bulletPoints.map((bullet, bulletIndex) => (
                      <View 
                        key={bulletIndex} 
                        style={faqStyles.bulletItem}
                        accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel={`Item ${bulletIndex + 1}: ${bullet}`}
                      >
                        <Text style={faqStyles.bullet} accessible={false}>•</Text>
                        <Text style={faqStyles.bulletText} accessible={false}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {faq.links && (
                  <View 
                    style={{ marginTop: 12 }}
                    accessible={false}
                  >
                    {faq.links.map((link, linkIndex) => (
                      <Pressable
                        key={linkIndex}
                        onPress={() => Linking.openURL(link.url).catch(() => {})}
                        style={{ marginVertical: 6 }}
                        accessible={true}
                        accessibilityRole="link"
                        accessibilityLabel={`Link to ${link.text}`}
                        accessibilityHint="Double tap to open in browser"
                      >
                        <Text 
                          style={{ color: colors.buttonBackground, textDecorationLine: 'underline' }}
                          accessible={false}
                        >
                          {link.text}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}