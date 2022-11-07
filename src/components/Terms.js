import React from 'react';
import { useState, useEffect } from 'react';
import './Terms.css';
export default function Terms(props) {
    const {type} = props;
    const [version, setSignatory] = useState('20200808');
  
    //useEffect(() => {
      // console.log(type, openDialog);
      //if (type === 'project') {
      //    setOpenProjectDialog(openDialog)
      //} else {
      //    setOpenAreaDialog(openDialog)
      //}
    //}; //, [openDialog, type]);

    return (
        <div className="scrollBoxActivateProject goldTrim">
            <p className="L1Heading">TERMS AND CONDITIONS OF ONLINE SERVICE</p>
            <p>
                These AccuDiligence Terms and Conditions of Service (“Terms”) describe your rights and responsibilities as a user of our online services. 
                These Terms are between you and AccuDiligence LLC (“AccuDiligence”). “You” or “you” means the entity you represent in accepting these Terms or, 
                if that does not apply, you individually.  If you are accepting on behalf of your employer or another entity, you represent and warrant that: 
                (i) you have full legal authority to bind your employer or such entity to these Terms; (ii) you have read and understand these Terms; and (iii) you 
                agree to these Terms on behalf of the party that you represent. If you don’t have the legal authority to bind your employer or the applicable entity
                please do not click “I have read and agree” (or similar checkbox) that is presented to you. 
            </p>
            <p className="L1Heading">USER NOTICE</p>
            <p>
                User Registration and Login into AccuDiligence.com is a free self-service. By accessing or using AccuDiligence, you agree to the AccuDiligence 
                Privacy Policy, Acceptable Use Policy, and this Terms and Conditions of Service. You are responsible for (and must have sufficient authority 
                to take) all actions that are performed on or through your AccuDiligence account. The party within your domain that administers your domain 
                within AccuDiligence controls and manages access to all Data submitted or uploaded (“Data”).  You also acknowledge that your account can become 
                managed by the entity that owns or controls the email address domain with which your account was created or registered.
            </p>
            <p>
                PLEASE NOTE THAT IF YOU SIGN UP FOR ACCUDILIGENCE USING AN EMAIL ADDRESS FROM YOUR EMPLOYER OR ANOTHER ENTITY, THEN (A) YOU WILL BE DEEMED TO 
                REPRESENT SUCH PARTY, (B) YOUR CLICK TO ACCEPT WILL BIND YOUR EMPLOYER OR THAT ENTITY TO THESE TERMS, AND (C) THE WORD “YOU” IN THESE TERMS WILL 
                REFER TO YOUR EMPLOYER OR THAT ENTITY.
            </p>
            <p>
                These Terms are effective as of the date you first click “I have read and agree” (or similar checkbox) or use or access AccuDiligence, 
                whichever is earlier (the “Effective Date”). These Terms do not have to be signed in order to be binding. You indicate your agreement 
                with these Terms by clicking “I have read and agree” (or similar checkbox) at the time you register, create an account, or purchase 
                AccuDiligence services.  
            </p>
            <p>
                These Terms cover our online services and related support.
            </p>
            <p  className="L1Heading">1. LICENSE GRANT AND RIGHT OF USE </p>
            <p>
                <span className="L2Heading">1.1 License Grant</span>. Subject to all limitations and restrictions contained herein and the Scope of the Order, 
                AccuDiligence grants You a nonexclusive, and nontransferable license to access and operate within Online Services as hosted by AccuDiligence 
                solely to perform those functions described in the Online Services.
            </p>
            <p>
                <span className="L2Heading">Competitor of AccuDiligence</span>: You may not access the Service if you are a direct competitor of 
                AccuDiligence, except with AccuDiligence's prior written consent. In addition, you may not access the Online Service for purposes 
                of monitoring its availability, performance or functionality, or for any other benchmarking or competitive purposes.
            </p>
            <p>
                <span className="L2Heading">1.2. Use</span>. You shall have a limited right and license to Use Online Services solely for its intended 
                diligence business purposes of a single system or platform within a single Target entity, using the functions described in the Online 
                Services. You shall not allow any website to frame, syndicate, distribute, replicate, or copy any portion of Online Services or 
                provide direct or indirect access to the Online Services and comply with Additional Restrictions (Section 1.4). Unless otherwise 
                expressly permitted in the Scope of the Order and subject to Authorized Users (Section 1.5), You shall not permit any subsidiaries, 
                affiliated companies, or third parties to access the Online Services.
            </p>
            <p>
                <span className="L2Heading">1.3. License Type</span>. Unless otherwise specifically stated, the Online Services is licensed per diligence 
                Project for each Order where the number of systems or platforms in the Scope of the Order is no more than one (1) and only at a 
                single Target entity. The Scope of the Order further limits the number of Authorized Users (Section 1.5) per Order.
            </p>
            <p>
                <span className="L2Heading">1.4. Additional Restrictions</span>. Except as otherwise expressly permitted in these Terms or as 
                permitted and limited via a separate Reseller’s Agreement, in no event shall You or your employees, affiliates, subsidiaries, or 
                through any third-party:
            </p>
            <p>
                (i) Copy, reproduce, modify, distribute, republish, adapt, incorporate or perform for commercial use or create derivative 
                works anything that you read or see on the AccuDiligence website and Online Services, including any of the source code or 
                HTML code that we use to generate the website and Online Services;
            </p>
            <p>
                (ii) rent, lease, distribute, sell, sublicense, transfer or provide access to the Online Services to a third party or for the benefit of any third party, except 
                as an authorized and contracted Third-Party Services / Resellers per Section 1.6.
            </p>
            <p>(iii) interfere with or otherwise circumvent mechanisms in the Online Services intended to limit your use;</p>
            <p>
                (iv) disassemble, decompile, reverse engineer, translate or otherwise seek to obtain or derive the 
                Confidential Information and Intellectual Properties (including source code, underlying ideas, algorithms, file formats or 
                non-public APIs to any Online Services), except to the extent expressly permitted by applicable law (and then only upon 
                advance notice to us). Disassembling, decompiling, and reverse engineering include, without limitation: 
            </p>
                <p className="indentBody">(a) converting the Online Services from a machine-readable form into a human-readable form; </p>
                <p className="indentBody">(b) disassembling or decompiling the Online Services by using any means or methods to translate machine-dependent or machine-independent object 
                    code into the original human-readable source code or any approximation thereof; </p>
                <p className="indentBody">(c) examining the machine-readable object code that controls the Online Service’s operation and creating the original source code or 
                    any approximation thereof by, for example, studying the Online Service’s behavior in response to a variety of inputs; or </p>
                <p className="indentBody">(d) performing any other activity related to the Online Services that could be construed to be reverse engineering, 
                    disassembling, or decompiling. To the extent any such activity may be permitted pursuant to written agreement with AccuDiligence, 
                    the results thereof shall be deemed Confidential Information and Intellectual Property subject to the requirements of these Terms. 
                    You may use AccuDiligence’s Confidential Information and Intellectual Property solely in connection with the Online Services and 
                    pursuant to these Terms.
                </p>
            <p>(v) remove or obscure any proprietary or other notices contained in any Online Service; </p>
            <p>(vi) use the Online Services for competitive analysis or to build competitive products; </p>
            <p>(vii) publicly disseminate information regarding the performance of the Online Services; or </p>
            <p>(viii) permit, encourage, or assist any third-party to do any of the foregoing.</p>
            <p>
                <span className="L2Heading">1.5. Authorized Users</span>. Unless otherwise specifically provided in the Scope of the Order, 
                “Authorized Users” will only consist of: 
            </p>
            <p>(i) You and the entity you represent (“Buyer End User”)</p>
            <p>
                (ii) Target/Seller users (“Seller End User”) that you designate and limited to Scope of Order, a number of same domain End Users designated by the 
                primary Seller End User of the domain, and
            </p>
            <p>
                <span className="L2Heading">1.6 Purchasing Through a Reseller</span>. If you make any purchases through an authorized 
                third-party partner or reseller of AccuDiligence (“Reseller”):
            </p>
            <p>
                (i) Instead of paying us, you will pay the applicable amounts to the Reseller, as agreed between you and the Reseller. We may suspend or terminate your 
                rights to use Online Services if we do not receive the corresponding payment from the Reseller.
            </p>
            <p>
                (ii) Your order details will be as stated in the Order placed with us by the Reseller on your behalf, and Reseller is responsible for the accuracy 
                of any such Order as communicated to us.
            </p>
            <p>
                (iii) If you are entitled to a refund under these Terms, then unless we otherwise specify, we will refund any applicable 
                fees to the Reseller and the Reseller will be solely responsible for refunding the appropriate amounts to you.
            </p>
            <p>
                (iv) Resellers are not authorized to modify these Terms or make any promises or commitments on our behalf, and we are 
                not bound by any obligations to you other than as set forth in these Terms.
            </p>
            <p>
                (v) The amount paid or payable by the Reseller to us for your use of the applicable Online Services under these Terms 
                will be deemed the amount actually paid or payable by you to us under these Terms for purposes of calculating the Liability Cap (Section 11.2).
            </p>
            <p>(vi) Your receipt or use of any third-party products or services (and the Reseller’s use of any of your Data) is subject to a separate agreement between 
                you and Reseller. If you enable or use Reseller products or services with the Online Services, we will allow the third-party providers to access or use 
                your Data as required for the interoperation of their products and services with our Online Services. This may include transmitting, transferring, 
                modifying or deleting your Data, or storing your Data on systems belonging to the Reseller’s providers or other third-parties. Any Reseller’s use of 
                your Data is subject to the applicable agreement between you and Reseller. We are not responsible for any access to or use of your Data by Resller 
                or their products or services, or for the security or privacy practices of any Reseller or its products or services. You are solely responsible for 
                your decision to permit any Reseller or Reseller product or service to use your Data. It is your responsibility to carefully review the agreement 
                between you and the Reseller. WE DISCLAIM ALL LIABILITY AND RESPONSIBILITY FOR ANY RESELLER OR THIRD-PARTY PRODUCTS OR SERVICES (WHETHER SUPPORT, 
                AVAILABILITY, SECURITY OR OTHERWISE) OR FOR THE ACTS OR OMISSIONS OF ANY THIRD-PARTY PROVIDERS OR VENDORS.
            </p>

            <p>(vii) THIRD-PARTY SERVICES / RESELLERS ARE PROVIDED ON AN “AS IS” AND “WITH ALL FAULTS” BASIS WITHOUT ANY WARRANTY WHATSOEVER AND ACCUDILIGENCE HEREBY 
                EXPRESSLY DISCLAIMS WITH RESPECT TO ANY THIRD-PARTY SERVICES / RESELLERS AND TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW: (A) ALL WARRANTIES, 
                WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
                NON-INFRINGEMENT; AND (B) ALL LIABILITY FOR DIRECT, INDIRECT, INCIDENTAL, SPECIAL, COVER, PUNITIVE, EXEMPLARY OR CONSEQUENTIAL DAMAGES, INCLUDING 
                WITHOUT LIMITATION LOST DATA OR LOST PROFITS, HOWEVER ARISING, WHETHER BASED IN CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN WHERE ADVISED 
                OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
                <span className="L2Heading">1.7. Administrators</span>. Through our Online Services, you may be able to specify certain End User as Administrator, 
                who will have important rights and controls over your use of Online Services and End User Accounts. The primary Seller End User is designated 
                within the Scope of the Order and is the default Administrator for Seller End Users per Order. Administrator rights may include making Orders 
                for Online Services (which may incur fees); creating, de-provisioning, monitoring or modifying End User Accounts, setting End User usage 
                permissions; and otherwise managing access. Administrators may also take over management of accounts previously registered using an 
                email address belonging to your domain (which become “managed accounts”). Without limiting to Responsibility for End Users (Section 1.10), 
                which fully applies to Administrators, you are responsible for whom you allow to become Administrators and any actions they take, 
                including as described above. You agree that our responsibilities do not extend to the internal management or administration of the 
                Online Services for you.
            </p>
            <p>
                Please note that you are responsible for the activities of all your End Users, including Orders they may place and how End Users use 
                your Data, even if those End Users are not from your organization or domain. AccuDiligence may display these Terms and/or our End 
                User Notice at sign up, account creation, Online Service registration, and/or in-product. If you use single sign-on (SSO) for 
                identity management of your Online Service such that End Users will bypass these screens and our User Notice, you are responsible 
                for displaying our End User Notice and for any damages resulting from your failure to do so.
            </p>
            <p>
                <span className="L2Heading">1.8. Reseller as Administrator</span>. If you order Online Services through a Reseller, then you are 
                responsible for determining whether the Reseller may serve as an Administrator and for any related rights or obligations in your 
                applicable agreement with the Reseller.  As between you and AccuDiligence, you are solely responsible for any access by Reseller 
                to your accounts or your other End User Accounts.
            </p>
            <p>
                <span className="L2Heading">1.9. End User Consent</span>. You will provide all required disclosures to and will obtain and maintain 
                all required consents from your End Users to allow Administrators to have the access described in these Terms and the Privacy 
                Policy, and to provision the Online Services to End Users. You will provide evidence of such consents upon our reasonable request. 
            </p>
            <p>
                <span className="L2Heading">1.10. Responsibility for End Users</span>. Our Online Services have multiple user onboarding 
                flows. Some Online Services require users to be designated by Administrators; some allow users to sign up for individual 
                accounts which can become associated with organizations at a later time; and some may allow users to invite other end users. 
                You are responsible for understanding the settings and controls for each Online Service you use and for controlling whom you 
                allow to become an End User. 
            </p>
            <p>
                If payment is required for End Users to use or access our Online Services, for example, then we are only required to provide 
                the Online Services to the End Users if you have paid the applicable fees. Some Online Services may allow you to designate 
                different types of End Users, in which case pricing and functionality may vary. You are responsible for compliance with 
                these Terms by all End Users, including any payment obligations.
            </p>
            <p>
                <span className="L2Heading">1.11. Credentials</span>. You must require that all End Users keep their user IDs and passwords for the Online 
                Services strictly confidential and do not share such information with any unauthorized person. User IDs are granted to individual, named persons and may not be shared. 
                You are responsible for any and all actions taken using End User Accounts and passwords, and you agree to immediately notify us of 
                any unauthorized use of which you become aware.
            </p>
            <p>
                <span className="L2Heading">1.12. Age Requirement for End Users</span>. The Online Services are not intended for, and should 
                not be used by, anyone under the age of 18. You are responsible for ensuring that all End Users are at least 18 years old.
            </p>
            <p>
                <span className="L2Heading">1.13. Domain Name Ownership</span>. Where you are required to specify a domain for the 
                peration of an Online Service or certain features, we may verify that you own or control that domain. If you do 
                not own or control the domain you specify, then we will have no obligation to provide you with the Online Service or associated features.
            </p>
            <p>
                <span className="L2Heading">1.14. Our Deliverables</span>. We will retain all right, title and interest in and to Our 
                Deliverables. You may use any of Our Deliverables provided to you only in connection with the Online Services, subject 
                to the same usage rights and restrictions as for the Online Services. For clarity, Our Deliverables are not considered 
                Online Services, and any Online Services are not considered to be Our Deliverables.
            </p>
            <p>
                <span className="L2Heading">1.15. Your Data</span>. You agree to provide us with reasonable access to your Data as reasonably 
                necessary for our provision of Order and/or Additional Consulting Services. If you do not provide us with timely 
                access to your Data, our performance will be excused until you do so. You retain your rights in your Data, subject 
                to our ownership of any Online Services, any of Our Deliverables or any of Our Technology underlying your Data. We 
                will use your Data for purposes of performing the Order or Additional Consulting Services and per the Limited License 
                to Data (Section 1.16). You represent and warrant that you have all necessary rights in your Data to provide them to 
                us for such purposes.
            </p>
            <p>
                <span className="L2Heading">1.16 Limited License to Data</span>. As between AccuDiligence and End Users, End Users 
                own all right, title, and interest in and to any data that we collect and stores on your behalf in providing the 
                Online Services. End User grants AccuDiligence a nonexclusive, nontransferable license to: 
            </p>
            <p>
                (i) capture and maintain your Data in connection with our provision of Online Services to End User and enforcement 
                of its rights as described in the applicable Order;
            </p>
            <p>
                (ii) compile aggregated statistics including the Data along with data of other customers for internal or marketing 
                use (provided that no such use shall include any information that can identify any End Users); and
            </p>
            <p>
                (iii) rights to use Your Data to provide Online Services per Scope of the Order for parties involved 
                as described in Using Your Data to Provide Online Services (Section 3.6).
            </p>
            <p>
                <span className="L2Heading">1.17. Additional Consulting Services</span>. Subject to these Terms, you may purchase 
                Additional Consulting Services that we will provide to you pursuant to or independent of the Scope of the Order. 
                Additional Consulting Services may be subject to additional policies and terms as specified by us through a separate 
                Statement of Work (“SOW”).
            </p>
            <p>
                <span className="L2Heading">1.18. Reservation of Rights</span>. AccuDiligence reserves all rights not specifically granted herein.
            </p>

            <p  className="L1Heading">2. ACCEPTABLE USE POLICY</p>
            <p>
                In order to provide quality of Online Services, we need help from you and your End Users prevent misuse or 
                abuse our services. Under this Acceptable Use Policy, without notice or liability if AccuDiligence (in its 
                sole discretion) determines that you or an End User has violated this Acceptable Use Policy, we reserve the 
                right to remove Data and/or suspend your access that is found inconsistent with the spirit of the following 
                guidelines, even if it’s something that is not forbidden by the letter of the policy. In this Acceptable Use Policy, 
                the term “Content” and “Data” means: 
            </p>
            <p>
                (i) any information, data, text, software, code, scripts, music, sound, photos, graphics, videos, messages, tags, interactive features, 
                or other materials that you post, upload, share, submit, or otherwise provide in any manner to the services, and 
            </p>
            <p>
                (ii) any other materials, content, or data you provide to AccuDiligence or use with the Online Services.
            </p>
            <p>The following Data and activities Sections 2.1 through Section 2.7 are forbidden:</p>
            <p>
                <span className="L2Heading">2.1 Disruption or Compromising the Integrity of Our Online Services</span>. This include 
                probing, scanning, or testing the vulnerability of any system or network that hosts our Online Services. This prohibition 
                does not apply to security assessments expressly permitted by AccuDiligence. Overwhelming or attempting to overwhelm 
                our infrastructure by imposing an unreasonably large load on our systems that consume extraordinary resources is 
                strictly prohibited, such as using “robots,” “spiders,” “offline readers,” or other automated systems to send more 
                request messages to our servers than a human could reasonably send in the same period of time by using a normal 
                browser and going far beyond the use parameters for any given feature within the Online Services as described in 
                its corresponding documentation. Consuming an unreasonable amount of storage for music, videos, etc., in a way 
                that’s unrelated to the purposes for which the services were designed.
            </p>
            <p>
                <span className="L2Heading">2.2. Tampering or Reverse-Engineering Our Online Services</span>. Tampering with, 
                reverse-engineering, or hacking our Online Services, circumventing our security or authentication measures, 
                or attempting to gain unauthorized access to the Online Services, related systems, networks, or data, is strictly 
                prohibited.
            </p>
            <p>
                <span className="L2Heading">2.3 Hacking Our Online Services</span>. Modifying, disabling, or compromising the 
                integrity or performance of the Online Services or related systems, network or data, including deciphering any
                transmissions to or from the servers running the Online Services is strictly prohibited.
            </p>
            <p>
                <span className="L2Heading">2.4 Wrongful Activities</span>. Misrepresentation of yourself, or disguising the origin 
                of any content (including by “spoofing”, “phishing”, manipulating headers or other identifiers, impersonating 
                anyone else, or falsely implying any sponsorship or association with AccuDiligence or any third party) or 
                using the Online Services to:
            </p>
            <p>
                (i) violate the privacy of others, including publishing or posting other people's private and confidential information 
                without their express permission, or collecting 
                or gathering other people’s personal information (including account names or information) from our services,
            </p>
            <p>(ii) stalk, harass, or post direct, specific threats of violence against others, </p>
            <p>(iii) perform any illegal purpose, or in violation of any laws (including without limitation data, privacy, and export control laws), </p>
            <p>(iv) access or search any part of the Online Services by any means other than our publicly supported interfaces (for example, “scraping”), and </p>
            <p>(v) repurpose or reuse meta tags or any other “hidden text” including AccuDiligence’s or our affiliates’ product names or trademarks.</p>
            <p>
                <span className="L2Heading">2.5 Inappropriate Communications</span>. Using the services to generate or send unsolicited 
                communications, advertising, chain letters, or spam, or to solicit our users for commercial purposes, unless expressly 
                permitted by AccuDiligence is strictly prohibited.
            </p>
            <p>
                <span className="L2Heading">2.6 Disparaging AccuDiligence or our partners, vendors, or affiliates</span>. Disparaging 
                AccuDiligence or our partners, vendors, or affiliates is prohibited. Similarly, promoting or advertising products or services 
                other than your own without appropriate authorization is prohibited.
            </p>
            <p>
                <span className="L2Heading">2.7 Inappropriate content</span>. Posting, uploading, sharing, submitting, or otherwise 
                providing content that infringes on AccuDiligence’s or a third-party’s intellectual property or other rights, including 
                any copyright, trademark, patent, trade secret, moral rights, privacy rights of publicity, or any other intellectual property 
                right or proprietary or contractual right is inappropriate and prohibited. You don’t have the right to submit deceptive, 
                fraudulent, illegal, obscene, defamatory, libelous, threatening, harmful to minors, pornographic (including child pornography, 
                which we will remove and report to law enforcement, including the National Center for Missing and Exploited Children), 
                indecent, harassing, or hateful Data. You do not have the right to submit Data that encourages illegal or tortious conduct 
                or that is otherwise inappropriate; that attacks others based on their race, ethnicity, national origin, religion, sex, 
                gender, sexual orientation, disability, or medical condition; that contains viruses, bots, worms, scripting exploits, or 
                other similar materials; that is intended to be inflammatory; that could otherwise cause damage to AccuDiligence or any third-party.
            </p>

            <p  className="L1Heading">3. SECURITY AND DATA PRIVACY POLICIES</p>
            <p>
                <span className="L2Heading">3.1. Security and Certifications</span>. We implement and maintain physical, technical and 
                administrative security measures designed to protect your Data from unauthorized access, destruction, use, modification, 
                or disclosure. We also maintain a compliance program that includes independent third-party audits and certifications. 
                Our Security Center is updated from time to time to provide further details on our security measures and certifications.
            </p>
            <p>
                <span className="L2Heading">3.2. Privacy</span>. We collect certain data and information about you and your End Users 
                in connection with you and your End Users’ use of the Online Services and otherwise in connection with these Terms. 
                We collect and use all such data and information in accordance with our Privacy Policy, which you acknowledge.
            </p>
            <p>
                <span className="L2Heading">3.3. Improving Online Services Through Data Analytics</span>. We are always striving to 
                improve our Online Services. In order to do so, we use analytics techniques to better understand how our Online Services 
                are being used. For more information on these techniques and the type of data collected, please read our Privacy Policy.
            </p>
            <p>
                <span className="L2Heading">3.4. Subpoenas</span>. Nothing in these Terms prevents us from disclosing your data to 
                the extent required by law, subpoenas or court orders, but we will use commercially reasonable efforts to notify you 
                as permitted to do so. AccuDiligence strives to balance your privacy rights with other legal requirements; to read 
                more about our policies and guidelines for law enforcement officials requesting access to customer data, please read 
                our Privacy Policy.
            </p>
            <p>
                <span className="L2Heading">3.5. GDPR Data Processing Addendum</span>. If you are in the EEAU, Switzerland, or are 
                otherwise subject to the territorial scope of Regulation (EU) 2016/679 (General Data Protection Regulation) or any 
                successor legislation, you can request and complete the AccuDiligence Data Processing Addendum from our Security Center.
            </p>
            <p>
                <span className="L2Heading">3.6. Using Your Data to Provide Online Services</span>. You retain all right, title and 
                interest in and to your Data in the form submitted to the Online Services. Subject to these Terms, and solely to the 
                extent necessary to provide the Online Services to you, you grant us a worldwide, limited term license to access, use, 
                process, copy, backup, distribute, perform, and display Your Data to authorized AccuDiligence personnel. Solely to the 
                extent that reformatting Your Data for display in an Online Service constitutes a modification or derivative work, the 
                foregoing license also includes the right to make modifications and derivative works. We may also access your End User 
                accounts and review your Online Services Data in order to respond to your support requests.
            </p>
            <p>
                <span className="L2Heading">3.7. Your Data Compliance Obligations</span>. You and your use of Online Services 
                (including use by your End Users) must comply at all times with these Terms, Acceptable Use Policy (Section 2), and 
                all Laws. You represent and warrant that:
            </p>
            <p>
                (i) You have obtained all necessary rights, releases and permissions to submit all your Data to the Online Services 
                and to grant the rights granted to us within these Terms and 
            </p>
            <p>
                (ii) Your Data and its submission and use as you authorize within these Terms will not violate any Laws; any third-party 
                intellectual property, privacy, publicity or other rights; or any of your third-party policies or terms governing your 
                Data. Other than our express obligations under this Section, we assume no responsibility or liability 
                related to compliance obligations of your Data, and you are solely responsible for your Data and the consequences 
                of submitting and using it with the Online Services.
            </p>
            <p>
                <span className="L2Heading">3.8. No Prohibited Sensitive Personal Information</span>. You will not submit to the Online 
                Services (or use the Online Services to collect) any Sensitive Personal Information unless its processing is expressly 
                supported as a specific feature within the applicable Online Service. Notwithstanding any other provision to the 
                contrary, we have no liability under these Terms for Sensitive Personal Information submitted in violation of the foregoing.
            </p>
            <p>
                <span className="L2Heading">3.9. Your Indemnity</span>. You will defend, indemnify and hold harmless AccuDiligence 
                (and our affiliates, officers, directors, agents and employees) from and against any and all claims, costs, damages, 
                losses, liabilities and expenses (including reasonable attorneys’ fees and costs) resulting from any claim arising 
                from or related to:
            </p>
            <p>(i) your breach of these Terms or any claims or disputes brought by your End Users arising out of their use of Online Services,</p>
            <p>
                (ii) your breach (or alleged breach) of Your Data Compliance Obligations (Sections 3.7) or No Prohibited Sensitive 
                Personal Information (Sections 3.8); or
            </p>
            <p>
                (iii) your Data. This indemnification obligation is subject to you receiving prompt written notice of such claim 
                (but in any event notice in sufficient time for you to respond without prejudice); the exclusive right to control 
                and direct the investigation, defense, or settlement of such claim; and all reasonably necessary cooperation by us at your expense.
            </p>
            <p>
                <span className="L2Heading">3.10. Removals and Suspension</span>. We have no obligation to monitor any Data uploaded to the 
                Online Services except within the performance of due diligence within the Scope of the Order for our Online Services. 
                We will use reasonable efforts to provide you with advance notice of removals and suspensions when practicable, but if we 
                determine that your actions endanger the operation of the Online Service or your End Users, or other End Users, we may suspend 
                your access or remove your Data immediately without notice. We have no liability to you for removing or deleting your Data 
                from or suspending your access to any Online Service as described here and within the Acceptable Use Policy (Section 2). 
                Nonetheless, if we deem such action necessary based on your violation of these Terms, including our Policies, or in response to 
                takedown requests that we receive following our guidelines for reporting copyright and trademark violations, we may remove your 
                Data from the Online Services, or suspend your access to the Online Services.
            </p>
            <p>
                <span className="L2Heading">3.11. Data Expiry and Purge</span>. Data provided in the course of performing Online Services 
                will expire and be purged from the system after 60 days from the completion of the Order or its early termination, whichever 
                is sooner. Deliverables generated from Order will be available for Buyer to download for up to 3 months. After these periods, 
                the data will be purged from our systems. After Order completion or after Order termination, Buyer or Target may request earlier 
                purge of Order data and deliverables via a written request.
            </p>

            <p  className="L1Heading">4. BILLING AND PAYMENT</p>
            <p>
                <span className="L2Heading">4.1. Pay Per Order</span>. All Online Services are offered as a pay per project or pay per 
                Order software license due upfront to access Online Services, excluding the No-Charge Service of registered user access. 
                No services are available on a monthly or annual subscription basis at this time; however, non-expiring End User registration 
                is a No-Charge service. 
            </p>
            <p>
                <span className="L2Heading">4.2 Additional Consulting Services Fees</span>.  Additional Consulting Services Fees will be 
                priced and collected via the terms of a separate SOW, and may include pre-approved travel, lodging and meal expenses for work 
                performed at any non-AccuDiligence location which we may charge as incurred shall be paid within thirty (30) days of the 
                date of invoice. Any late payment shall be subject to any costs of collection (including reasonable legal fees) and shall bear 
                interest at the rate of one and one-half percent (1.5%) per month (prorated for partial periods) or at the maximum rate 
                permitted by law, whichever is less. If you have set up a direct debit, we will not debit your designated account before 
                seven (7) days have elapsed from the date of the invoice. Complaints concerning invoices must be made in writing within 
                thirty (30) days from the date of the invoice.
            </p>
            <p>
                <span className="L2Heading">4.3. Payment</span>. You will pay all fees in accordance with each Order at the start of the 
                Order and in the currency specified in the Order in order to obtain license to use under these Terms. Online immediate 
                payment options are available at Order checkout; however, PO number invoicing or alternate form of payment may be available 
                by contacting support@AccuDiligence.com. Other than as expressly set forth in Project Termination and Restart (Section 5.3), 
                Warranty Remedy (Section 10.3), IP Indemnification (Section 12) or Changes to these Terms (Section 16), all amounts are 
                non-refundable, non-cancelable and non-creditable. You agree that depending on the Scope of the Order, we may bill your 
                credit card or other payment method for expenses and your unpaid fees as applicable and published at checkout of your Order.
            </p>
            <p>
                <span className="L2Heading">4.4. Early Order Termination</span>. The completion of the Order depends on the ability of the 
                Seller End Users to complete the Order’s Data requests within the requested completion date at the start of the Order. You 
                or your Administrator as the Buyer or Investor may communicate a date of completion, however such request is not binding 
                to any Online Services’ logic to terminate the Order. Except as otherwise specified in your Order, you or your Administrator 
                may terminate Order prior to Seller End Users completion of Order’s Data requests, in which case:
            </p>
            <p>(i) access to Order by Seller End Users is suspended, except access to our general support;</p>
            <p>
                (ii) Our Deliverables for the Order will be compiled and provided as is with incomplete areas highlighted in the Quality
                of Evidence section of Our Deliverables;
            </p>
            <p>
                (iii) Compiling and making Our Deliverables available for your access will constitute completion and delivery of 
                Order as agreed including the treatment of incomplete Seller End User areas; and 
            </p>
            <p>
                (iv) You will not receive any refunds or credits for amounts that have already been charged specifically for the Order’s 
                license to use Online Services and any applicable non-refundable fees identified at checkout. Buyer Termination 
                is not equivalent to Order Cancellation (Section 5.4).
            </p>
            <p>
                Buyer has 60 days to reinstate a terminated Order to allow Target to continue to complete Order. No additional 
                fees will be assessed. After 60 days based on AccuDiligence data retention and related Privacy Policy, 
                the Order Data will be purged from the system and a new Order is required to be purchased, even for the same Target.
            </p>
            <p>
                <span className="L2Heading">4.5. Order Cancellation</span>. Target Administrator may request Order Cancellation 
                PRIOR TO SELLER END USER ACCEPTING THESE TERMS AND CONDITIONS OF SERVICE AFTER REGISTRATION BUT BEFORE ENTERING 
                ANY DATA. In this case, a Deliverable cannot be compiled and the Buyer will receive refund for Order minus applicable 
                non-refundable, non-cancelable, non-creditable setup fees as agreed at Payment of Order. If Buyer terminates order 
                PRIOR TO TARGET ENTERING ANY PROJECT DATA, the termination will be treated similarly as an Order Cancellation in terms 
                of a refund minus applicable non-refundable, non-cancelable, non-creditable setup fees as agreed at Payment, and the 
                Order cannot be reinstated.
            </p>
            <p>
                Target End Users have no payment or billing responsibilities to AccuDiligence in their access and in the 
                performance of completing an Order.
            </p>
            <p>
                <span className="L2Heading">4.6. Adding Users</span>. Your Administrator may add end users by placing a 
                new Order or modifying an existing Order on the Buyer Side, or through the Online Services features for 
                the Seller Administrator. Unless otherwise specified in the applicable Order, limits apply as to the maximum 
                number of users for Buyers and for Sellers. We do not charge for any increased End Users within the same Order, 
                though additional fees apply if exceeding the maximum number of users.
            </p>
            <p>
                <span className="L2Heading">4.7. Our Deliverables</span>. Your registered user account is required to create 
                and pay for Orders, as well as receive Our Deliverables after the completion of Order and once we have received 
                any final payment of the applicable fees related to Order. You are responsible for accessing your account to 
                determine that we have received payment and that your Order has been processed. All deliveries under these 
                Terms will be electronic.
            </p>
            <p>
                <span className="L2Heading">4.8. Our Return Policy</span>. We are committed to customer satisfaction and 
                without limiting the Performance Warranty in Warranties and Disclaimer (Section 10), you may cancel your 
                Order per the Order Cancellation (Section 4.4) terms, for no reason or any reason, by providing notice 
                of cancellation to us at support@accudiligence.com or via the Online Service interfaces when available to 
                do so. As a majority of our trade secret and intellectual property is disclosed as Target begins Data entry 
                into the Online Services, our Terms grant license to begin use rather than the normal fee paid at the end 
                of the engagement for Our Deliverables. Additional Consulting Services payment terms are outside of Online 
                Services and thus the termination or cancellation for Additional Consulting Services will be governed by 
                the associated SOW. You understand that we may change this practice in the future in accordance with Changes 
                to These Terms (Section 16).
            </p>
            <p>
                <span className="L2Heading">4.9. Taxes Not Included</span>. Your fees under these Terms exclude any taxes 
                or duties payable in respect of the Online Services in the jurisdiction where the payment is either 
                made or received. To the extent that any such taxes or duties are payable by us, you must pay to us the 
                amount of such taxes or duties in addition to any fees owed under these Terms. Notwithstanding the foregoing, 
                if you have obtained an exemption from relevant taxes or duties as of the time such taxes or duties are 
                levied or assessed, you may provide us with such exemption information, and we will use reasonable efforts 
                to provide you with invoicing documents designed to enable you to obtain a refund or credit from the 
                relevant revenue authority, if such a refund or credit is available.
            </p>
            <p>
                <span className="L2Heading">4.10. Withholding Taxes</span>. You will pay all fees net of any applicable 
                withholding taxes. You and we will work together to avoid any withholding tax if exemptions, or a 
                reduced treaty withholding rate, are available. If we qualify for a tax exemption, or a reduced treaty 
                withholding rate, we will provide you with reasonable documentary proof. You will provide us reasonable 
                evidence that you have paid the relevant authority for the sum withheld or deducted.
            </p>

            <p className="L1Heading">5. HOSTING</p>
            <p>
                <span className="L2Heading">5.1. Service Availability</span>. Service Provider will use reasonable 
                efforts to achieve Service Provider’s availability goals described in the Service Level Agreement.
            </p>
            <p>
                <span className="LHeading">5.2. Support Services</span>. Upon payment of the relevant fees on 
                the applicable Order, Customer may receive certain support services for the Online Services and 
                Additional Consulting Services pursuant to our Support Agreement.
            </p>

            <p  className="L1Heading">6. NO CONTINGENCIES ON OTHER PRODUCTS OR FUTURE FUNCTIONALITY</p>
            <p>
                You acknowledge that the Online Services and any Additional Consulting Services referenced in an Order or 
                SOW are being purchased separately from any of our other products or services and agree that your purchases 
                are not contingent on the delivery of any future functionality or features (including future availability of 
                any Online Services beyond the current Terms), or dependent on any oral or written public comments we make regarding 
                future functionality or features.
            </p>

            <p  className="L1Heading">7. IP RIGHTS IN THE ONLINE SERVICES AND FEEDBACK</p>
            <p>
                Online Services are made available on a limited access basis, and no ownership right is conveyed to you, irrespective 
                of the use of terms such as “purchase” or “sale”. We and our licensors have and retain all right, title and interest, 
                including all intellectual property rights, in and to Our Technology (including the Online Services). From time to time, 
                you may choose to submit Feedback to us. We may in connection with any of our products or services freely use, copy, 
                disclose, license, distribute and exploit any Feedback in any manner without any obligation, royalty or restriction based 
                on intellectual property rights or otherwise. No Feedback will be considered your Confidential Information, and nothing 
                in these Terms limits our right to independently use, develop, evaluate, or market products or services, whether incorporating
                Feedback or otherwise.
            </p>

            <p  className="L1Heading">8. CONFIDENTIALITY</p>
            <p>
                Except as otherwise set forth in these Terms, each party agrees that all code, inventions, know-how and business, 
                technical and financial information disclosed to such party (“Receiving Party”) by the disclosing party 
                ("Disclosing Party") constitute the confidential property of the Disclosing Party (“Confidential Information”), 
                provided that it is identified as confidential at the time of disclosure or should be reasonably known by the 
                Receiving Party to be confidential or proprietary due to the nature of the information disclosed and the circumstances 
                surrounding the disclosure. Any of Our Technology and any performance information relating to the Online Services will 
                be deemed our Confidential Information without any marking or further designation. Except as expressly authorized herein, 
                the Receiving Party will hold in confidence and not disclose any Confidential Information to third-parties and not use 
                Confidential Information for any purpose other than fulfilling its obligations and exercising its rights under these Terms.
            </p>
            <p>
                The Receiving Party may disclose Confidential Information to it employees, agents, contractors and other 
                representatives having a legitimate need to know, provided that they are bound to confidentiality 
                obligations no less protective of the Disclosing Party than this Section and that the Receiving Party 
                remains responsible for compliance by them with the terms of this Section. The Receiving Party's confidentiality obligations 
                will not apply to information which the Receiving Party can document: 
            </p>
            <p>(i) was rightfully in its possession or known prior to receipt of the Confidential Information; </p>
            <p>(ii) is or has become public knowledge through no fault of the Receiving Party; </p>
            <p>(iii) is rightfully obtained by the Receiving Party from a third party without breach of any confidentiality obligation; or </p>
            <p>(iv) is independently developed by employees of the Receiving Party who had no access to such information. </p>

            <p>
                The Receiving Party may also disclose Confidential Information if required pursuant to a regulation, law or court order 
                (but only to the minimum extent required to comply with such regulation or order and with advance notice to the Disclosing Party). 
                The Receiving Party acknowledges that disclosure of Confidential Information would cause substantial harm for 
                which damages alone would not be a sufficient remedy, and therefore that upon any such disclosure by the Receiving Party 
                the Disclosing Party will be entitled to appropriate equitable relief in addition to whatever other remedies it might have at law.
            </p>

            <p  className="L1Heading">9. ACCOUNT TERM AND TERMINATION</p>
            <p>
                <span className="L2Heading">9.1. Account Term</span>. These Terms are effective as of the Effective Date and expire on the date of 
                expiration, completion, or termination of all Orders under Terms, other than provisions stated per Survival (Section 9.5).
            </p>
            <p>
                <span className="L2Heading">9.2. Account Termination for Cause</span>. Either party may terminate these Terms (including 
                all related Orders) if the other party fails to cure any material breach of these Terms within thirty (30) days 
                after notice; ceases operation without a successor; or seeks protection under any bankruptcy, receivership, trust deed, 
                creditors’ arrangement, composition or comparable proceeding, or if any such proceeding is instituted against that party 
                (and not dismissed within sixty (60) days thereafter).
            </p>
            <p>
                <span className="L2Heading">9.3. Account Termination for Convenience</span>. You may choose to stop using the 
                Online Services and terminate these Terms (including any or all Orders) at any time for any reason upon written notice to 
                us, but, unless you are exercising your right to terminate early pursuant to Our Return Policy (Section 4.7), upon any such 
                termination you will not be entitled to a refund of any paid fees and if you have not already paid all applicable fees for 
                the then-current Terms, Orders, or Additional Consulting Services, any such fees that are outstanding will become immediately 
                due and payable.
            </p>
            <p>
                <span className="L2Heading">9.4. Effects of Account Termination</span>. Upon any expiration or termination of these Terms, 
                you must cease using all Online Services, including on any Reseller or Resellers systems operated on your behalf. Buyers will 
                be denied access to account login and Order dashboard. Any Orders in progress would be terminated and a final Deliverables 
                available upon request via email to Buyer representative. We will delete all of your Data per our Data Expiry and Purge (Section 3.11) 
                unless legally prohibited after expiration or termination of these Terms, so you should make sure to download your Deliverable using 
                the functionality of the Online Services prior to Term.
            </p>
            <p>
                If Terms are terminated in accordance with Account Termination for Cause (Section 9.2), you will pay any unpaid Additional 
                Consulting Services or Order fees covering the remainder of the then-current Terms after the effective date of termination. 
                In no event will termination relieve you of your obligation to pay any fees payable to us for the period prior to the effective 
                date of termination.
            </p>
            <p>
                Except where an exclusive remedy may be specified in these Terms, the exercise by either party of any remedy, including termination, 
                will be without prejudice to any other remedies it may have under these Terms, by law or otherwise.
            </p>
            <p>
                <span className="L2Heading">9.5. Survival</span>. The following provisions will survive any termination or expiration of these 
                Terms: Additional Restrictions (Section 1.4), Purchasing Through a Reseller (Section 1.6), Your Indemnity (Section 3.9), Data 
                Expiry and Purge (Section 3.11), Payment (Section 4.2), Taxes not included (Section 4.8), IP Rights in the Online Services and 
                Feedback (Section 7), Confidentiality (Section 8), Account Term and Termination (Section 9), Warranty Disclaimer (Section 10), 
                Limitations of Liability (Section 11), IP Indemnification (Section 12) but solely with respect to claims arising from your use 
                of Online Services during the Subscription Term), Dispute Resolution (Section 14) and General Provisions (Section 17). 
            </p>

            <p  className="L1Heading">10. WARRANTIES AND DISCLAIMER</p>
            <p>
                <span className="L2Heading">10.1. Mutual Warranties</span>. Each party represents and warrants that it has the legal power and 
                authority to enter into these Terms.
            </p>
            <p>
                <span className="L2Heading">10.2. Our Warranties</span>. We warrant, for your benefit only, that we use commercially reasonable 
                efforts to prevent introduction of viruses, Trojan horses or similar harmful materials into the Online Services (but we are not 
                responsible for harmful materials submitted by you or End Users) (the “Performance Warranty”).
            </p>
            <p>
                <span className="L2Heading">10.3. Warranty Remedy</span>. We will use commercially reasonable efforts, at no charge to you, 
                to correct reported non-conformities with the Performance Warranty. If we determine corrections to be impracticable, either 
                party may terminate the applicable Term. In this case, you will receive a refund of any fees you have pre-paid for use of the 
                Online Product for the terminated portion of the applicable Term. The Performance Warranty will not applyunless you make a 
                claim within thirty (30) days of the date on which you first noticed the non-conformity, if the non-conformity was caused by 
                misuse, unauthorized modifications or third-party products, software, services or equipment. Our sole liability, and your sole 
                and exclusive remedy, for any breach of the Performance Warranty are set forth in this Section.
            </p>
            <p>
                <span className="L2Heading">10.4. WARRANTY DISCLAIMER</span>. EXCEPT AS EXPRESSLY PROVIDED IN THIS SECTION 10, ALL CLOUD 
                PRODUCTS, SUPPORT AND ADDITIONAL SERVICES ARE PROVIDED “AS IS,” AND WE AND OUR SUPPLIERS EXPRESSLY DISCLAIM ANY AND ALL 
                WARRANTIES AND REPRESENTATIONS OF ANY KIND, INCLUDING ANY WARRANTY OF NON-INFRINGEMENT, TITLE, FITNESS FOR A PARTICULAR PURPOSE, 
                FUNCTIONALITY OR MERCHANTABILITY, WHETHER EXPRESS, IMPLIED OR STATUTORY. WITHOUT LIMITING OUR EXPRESS OBLIGATIONS IN THESE 
                TERMS, WE DO NOT WARRANT THAT YOUR USE OF THE CLOUD PRODUCTS WILL BE UNINTERRUPTED OR ERROR-FREE, THAT WE WILL REVIEW YOUR 
                DATA FOR ACCURACY OR THAT WE WILL PRESERVE OR MAINTAIN YOUR DATA WITHOUT LOSS. YOU UNDERSTAND THAT USE OF THE CLOUD PRODUCTS 
                NECESSARILY INVOLVES TRANSMISSION OF YOUR DATA OVER NETWORKS THAT WE DO NOT OWN, OPERATE OR CONTROL, AND WE ARE NOT RESPONSIBLE 
                FOR ANY OF YOUR DATA LOST, ALTERED, INTERCEPTED OR STORED ACROSS SUCH NETWORKS. WE CANNOT GUARANTEE THAT OUR SECURITY PROCEDURES 
                WILL BE ERROR-FREE, THAT TRANSMISSIONS OF YOUR DATA WILL ALWAYS BE SECURE OR THAT UNAUTHORIZED THIRD PARTIES WILL NEVER BE ABLE 
                TO DEFEAT OUR SECURITY MEASURES OR THOSE OF OUR THIRD-PARTY SERVICE PROVIDERS. WE WILL NOT BE LIABLE FOR DELAYS, INTERRUPTIONS, 
                SERVICE FAILURES OR OTHER PROBLEMS INHERENT IN USE OF THE INTERNET AND ELECTRONIC COMMUNICATIONS OR OTHER SYSTEMS OUTSIDE OUR 
                REASONABLE CONTROL. YOU MAY HAVE OTHER STATUTORY RIGHTS, BUT THE DURATION OF STATUTORILY REQUIRED WARRANTIES, IF ANY, WILL BE 
                LIMITED TO THE SHORTEST PERIOD PERMITTED BY LAW.
            </p>

            <p  className="L1Heading">11. LIMITATION OF LIABILITY</p>
            <p>
                <span className="L2Heading">11.1. Consequential Damages Waiver</span>. EXCEPT FOR EXCLUDED CLAIMS (AS DEFINED BELOW), NEITHER 
                PARTY (NOR ITS SUPPLIERS) WILL HAVE ANY LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS FOR ANY LOSS OF USE, LOST OR 
                INACCURATE DATA, LOST PROFITS, FAILURE OF SECURITY MECHANISMS, INTERRUPTION OF BUSINESS, COSTS OF DELAY, OR ANY INDIRECT, 
                SPECIAL, INCIDENTAL, RELIANCE OR CONSEQUENTIAL DAMAGES OF ANY KIND, EVEN IF INFORMED OF THE POSSIBILITY OF SUCH DAMAGES IN ADVANCE. 
            </p>
            <p>
                <span className="L2Heading">11.2. Liability Cap</span>. EXCEPT FOR EXCLUDED CLAIMS, EACH PARTY’S AND ITS SUPPLIERS’ AGGREGATE 
                LIABILITY TO THE OTHER ARISING OUT OF OR RELATED TO THESE TERMS WILL NOT EXCEED THE AMOUNT ACTUALLY PAID BY YOU TO US UNDER 
                THESE TERMS AND SPECIFIC TO YOUR ASSOCIATED ORDER OR ADDITIONAL CONSULTING SERVICES WITHIN THE CLAIM.
            </p>
            <p>
                <span className="L2Heading">11.3. Excluded Claims</span>. “Excluded Claims” means amounts owed by you under any Orders, 
                either party’s express indemnification obligations in these Terms or your breach of Additional Restrictions (Section 1.4).
            </p>
            <p>
                <span className="L2Heading">11.4. Nature of Claims and Failure of Essential Purpose</span>. The parties agree that the waivers 
                and limitations specified in this Section apply regardless of the form of action, whether in contract, tort (including 
                negligence), strict liability or otherwise and will survive and apply even if any limited remedy specified in these Terms is 
                found to have failed of its essential purpose.
            </p>

            <p  className="L1Heading">12. IP INDEMNIFICATION</p>
            <p>
                We will defend you against any claim brought against you by a third party alleging that the Online Services, when used as authorized 
                under these Terms, infringe any third-party patent, copyright or trademark, or misappropriates any third-party trade secret enforceable 
                in any jurisdiction that is a signatory to the Berne Convention (a “Claim”), and we will indemnify you and hold you harmless against 
                any damages and costs finally awarded on the Claim by a court of competent jurisdiction or agreed to via settlement executed by us 
                (including reasonable attorneys’ fees), provided that we have received from you: 
            </p>
            <p>(i) prompt written notice of the Claim (but in any event notice in sufficient time for us to respond without prejudice);</p>
            <p>
                (ii) reasonable assistance in the defense and investigation of the Claim, including providing us a copy of the Claim, all relevant 
                evidence in your possession, 
                custody, or control, and cooperation with evidentiary discovery, litigation, and trial, including making witnesses within 
                your employ or control available for testimony; and 
            </p>
            <p>
                (iii) the exclusive right to control and direct the investigation, defense, and settlement (if applicable) of the Claim.
            </p>
            <p>
                If your use of the Online Services is (or in your opinion is likely to be) enjoined, whether by court order or by settlement, 
                or if we determine such actions 
                are reasonably necessary to avoid material liability, we may, at our option and in our discretion: procure the right for your continued use of the Online 
                Product in accordance with these Terms; or terminate your right to continue using the Online Product and refund any prepaid amounts for the terminated 
                portion of the Term. Our indemnification obligations above do not apply: 
            </p>
            <p>
                (i) if the total aggregate fees we receive with respect to your fees to Online Product in the twelve (12) month 
                period immediately preceding the Claim is less than US$50,000;
            </p>
            <p>(ii) if the Online Product is modified by any party other than us, but to the extent the alleged infringement is caused by such modification; </p>
            <p>
                (iii) if the Online Product is used in combination with any non-AccuDiligence product, software, service or equipment, but 
                to the extent the alleged infringement is caused by such combination to unauthorized use of Online Services;
            </p>
            <p>
                (iv) to any Claim arising as a result of your Data or circumstances covered by your indemnification obligations in Your Indemnity
                (Section 2.9) or any third-party deliverables, components, or Data processed with the Online Services, or 
            </p>
            <p>(vi) if you settle or make any admissions with respect to a Claim without our prior written consent. </p>
            <p>
                THIS IP INDEMNIFICATION SECTION STATES OUR SOLE LIABILITY AND YOUR EXCLUSIVE REMEDY FOR ANY INFRINGEMENT OF INTELLECTUAL 
                PROPERTY RIGHTS IN CONNECTION WITH ANY CLOUD PRODUCT OR OTHER ITEMS WE PROVIDE UNDER THESE TERMS.
            </p>

            <p  className="L1Heading">13. PUBLICITY RIGHTS</p>
            <p>
                We may identify you as an AccuDiligence customer in our promotional materials only with your express written consent. 
                We may count your participation and quantity of Orders anonymously and in aggregation with other End Users 
                without your express written consent.
            </p>

            <p  className="L1Heading">14. DISPUTE RESOLUTION</p>
            <p>
                <span className="L2Heading">14.1. Informal Resolution</span>. In the event of any controversy or claim arising out of or relating 
                to these Terms, the parties will consult and negotiate with each other and, recognizing their mutual interests, attempt to 
                reach a solution satisfactory to both parties. If the parties do not reach settlement within a period of sixty (60) days, 
                either party may pursue relief as may be available under these Terms pursuant to Governing Law; Jurisdiction (Section 16.2). 
                All negotiations pursuant to this Section will be confidential and treated as compromise and settlement negotiations for 
                purposes of all rules and codes of evidence of applicable legislation and jurisdictions.
            </p>
            <p>
                <span className="L2Heading">14.2. Governing Law; Jurisdiction</span>. These Terms will be governed by and construed 
                in accordance with the applicable laws of the State of Florida, USA, without giving effect to the principles of 
                that State relating to conflicts of laws. Each party irrevocably agrees that any legal action, suit or proceeding 
                arising out of or related to these Terms must be brought solely and exclusively in, and will be subject to the 
                service of process and other applicable procedural rules of, the State or Federal court in Tampa, Florida, 
                USA, and each party irrevocably submits to the sole and exclusive personal jurisdiction of the courts in 
                Tampa, Florida, USA, generally and unconditionally, with respect to any action, suit or proceeding brought 
                by it or against it by the other party. In any action or proceeding to enforce a party’s rights under these 
                Terms, the prevailing party will be entitled to recover its reasonable costs and attorneys’ fees.
            </p>
            <p>
                <span className="L2Heading">14.3. Injunctive Relief; Enforcement</span>. Notwithstanding the provisions of 
                Informal Resolution (Section 14.1) and Governing Law; Jurisdiction (Section 14.2), nothing in these Terms will prevent 
                us from seeking injunctive relief with respect to a violation of intellectual property rights, confidentiality obligations 
                or enforcement or recognition of any award or order in any appropriate jurisdiction.
            </p>
            <p>
                <span className="L2Heading">14.4. Exclusion of UN Convention and UCITA</span>. The terms of the United Nations Convention 
                on Contracts for the Sale of Goods do not apply to these Terms. The Uniform Computer Information Transactions Act (UCITA) 
                will not apply to these Terms regardless of when or where adopted.
            </p>

            <p  className="L1Heading">15. EXPORT RESTRICTIONS</p>
            <p>
                The Online Services are subject to export restrictions by the United States government and may be subject to import restrictions by certain foreign 
                governments, and you agree to comply with all applicable export and import laws and regulations in your access to, and use of the Online Services 
                (or any part thereof). You shall not (and shall not allow any third-party to) remove or export from the United States or allow the export or re-export 
                of any part of the Online Services or any direct product thereof: (a) into (or to a national or resident of) any embargoed or terrorist-supporting 
                country; (b) to anyone on the U.S. Commerce Department’s Denied Persons, Entity, or Unverified Lists or the U.S. Treasury Department’s list of Specially 
                Designated Nationals and Consolidated Sanctions list (collectively, “Prohibited Persons”); (c) to any country to which such export or re-export is restricted 
                or prohibited, or as to which the United States government or any agency thereof requires an export license or other governmental approval at the time of 
                export or re-export without first obtaining such license or approval; or (d) otherwise in violation of any export or import restrictions, laws or 
                regulations of any United States or foreign agency or authority. You represent and warrant that (i) you are not located in, under the control of, 
                or a national or resident of any such prohibited country and (ii) none of your Data is controlled under the U.S. International Traffic in Arms 
                Regulations or similar Laws in other jurisdictions. You also certify that you are not a Prohibited Person nor owned, controlled by, or acting 
                on behalf of a Prohibited Person. You agree not to use or provide the Online Services for any prohibited end use, including to support any nuclear, 
                chemical, or biological weapons proliferation, or missile technology, without the prior permission of the United States government.
            </p>

            <p className="L1Heading">16. CHANGES TO THESE TERMS</p>
            <p>
                We may modify the terms and conditions of these Terms (including Our Policies) from time to time, with notice to you in accordance with 
                Notices (Section 19.1) or by posting the modified Terms on our website. Together with notice, we will specify the effective date of the modifications.
            </p>
            <p>
                <span className="L2Heading">16.1. Changes to Our Policies</span>. We may modify Our Policies to take effect during your then-current 
                Term in order to respond to changes in our products, our business, or Laws. In this case, unless required by Laws, we agree not to make
                modifications to Our Policies that, considered as a whole, would substantially diminish our obligations during your then-current Term. 
                Modifications to Our Policies will take effect automatically as of the effective date specified for the updated policies.
            </p>
            <p>
                <span className="L2Heading">16.2 Changes to the Online Services</span>. You acknowledge that the Online Services are on-line products, 
                and that in order to provide improved customer experience we may make changes 
                to the Online Services, and we may update the applicable Documentation accordingly. Subject to our obligation to provide Online Services and 
                Additional Consulting Services under existing Orders, we can discontinue any Online Services, any Additional Consulting Services, or any portion 
                or feature of any Online Services for any reason at any time without liability to you.
            </p>

            <p  className="L1Heading">17. GENERAL PROVISIONS</p>
            <p>
                <span className="L2Heading">17.1. Notices</span>. Any notice under these Terms must be given in writing. We may provide notice 
                to you through your Notification Email Address, your account or in-product notifications. You agree that any electronic communication 
                will satisfy any applicable legal communication requirements, including that such communications be in writing. Any notice to you will 
                be deemed given upon the first business day after we send it. You will provide notice to us in writing via post to Attn: General Counsel, 
                AccuDiligence, Inc., 7901 4th St N, Suite 300, St. Petersburg, FL, USA 33702. Your notices to us will be deemed given upon receipt.
            </p>
            <p>
                <span className="L2Heading">17.2. Force Majeure</span>. Neither party will be liable to the other for any delay or failure to perform 
                any obligation under these Terms (except for a failure to pay fees) if the delay or failure is due to events which are beyond the
                reasonable control of such party, such as a strike, blockade, war, act of terrorism, riot, natural disaster, failure or diminishment
                of power or telecommunications or data networks or services, or refusal of a license by a government agency.
            </p>
            <p>
                <span className="L2Heading">17.3. Assignment</span>. You may not assign or transfer these Terms without our prior written consent. As 
                an exception to the foregoing, you may assign these Terms in their entirety (including all Orders) to your successor resulting from a 
                merger, acquisition, or sale of all or substantially all of your assets or voting securities, provided that you provide us with prompt 
                written notice of the assignment and the assignee agrees in writing to assume all of your obligations under these Terms. Any attempt 
                by you to transfer or assign these Terms except as expressly authorized above will be null and void. We may assign our rights and 
                obligations under these Terms (in whole or in part) without your consent. We may also permit our Affiliates, agents and contractors 
                to exercise our rights or perform our obligations under these Terms, in which case we will remain responsible for their compliance 
                with these Terms. Subject to the foregoing, these Terms will inure to the parties’ permitted successors and assigns.
            </p>
            <p>
                <span className="L2Heading">17.4. Government End Users</span>. Any United States federal, state, or local government 
                customers are subject to a separate Government Amendment in addition to these Terms.
            </p>
            <p>
                <span className="L2Heading">17.5. Opportunity to Cure</span>. Notwithstanding anything contained hereunder, Customer 
                agrees and acknowledges that no dispute resolution or litigation shall be pursued by Customer for any breach of these 
                SaaS Terms until and unless Service Provider has had an opportunity to cure any alleged breach. Customer agrees to provide 
                Service Provider with a detailed description of any alleged failure and a description of the steps that Customer understands 
                must be taken by Service Provider to resolve the failure. Service Provider shall have thirty (30) days from Service Provider’s 
                receipt of Customer’s notice to complete the cure.
            </p>
            <p>
                <span className="L2Heading">17.6 Injunctive Relief</span>. The choice of venue does not prevent a party from seeking 
                injunctive relief in any appropriate jurisdiction with respect to a violation of intellectual property rights or confidentiality 
                obligations. For clarity, the parties may apply to any court of competent jurisdiction for a temporary restraining order, 
                preliminary injunction, or other interim or conservatory relief as necessary, without breach of this Section and without 
                abridgment of the powers of the mediator.
            </p>
            <p>
                <span className="L2Heading">17.7. Entire Agreement</span>. These Terms are the entire agreement between you and us relating
                to the Online Services and any other subject matter covered by these Terms, and supersede all prior or contemporaneous oral
                or written communications, proposals and representations between you and us with respect to the Online Services or any other 
                subject matter covered by these Terms. No provision of any purchase order or other business form employed by you will supersede 
                or supplement the terms and conditions of these Terms, and any such document relating to these Terms will be for administrative 
                purposes only and will have no legal effect.
            </p>
            <p>
                <span className="L2Heading">17.8. Conflicts</span>. In event of any conflict between the main body of these Terms 
                and either Our Policies or Product-Specific Terms, Our Policies or Product-Specific Terms (as applicable) will control with 
                respect to their subject matter.
            </p>
            <p>
                <span className="L2Heading">17.9. Waivers; Modifications</span>. No failure or delay by the injured party to these Terms in 
                exercising any right, power or privilege hereunder will operate as a waiver thereof, nor will any single or partial exercise 
                thereof preclude any other or further exercise thereof or the exercise of any right, power or privilege hereunder at law or 
                equity. Except as set forth in Changes to these Terms (Section 16), any amendments or modifications to these Terms must be 
                executed in writing by an authorized representative of each party.
            </p>
            <p>
                <span className="L2Heading">17.10. Interpretation</span>. As used herein, “including” (and its variants) means “including 
                without limitation” (and its variants). Headings are for convenience only. If any provision of these Terms is held to be void, 
                invalid, unenforceable or illegal, the other provisions will continue in full force and effect.
            </p>
            <p>
                <span className="L2Heading">17.11. Independent Contractors</span>. The parties are independent contractors. These Terms will not 
                be construed as constituting either party as a partner of the other or to create any other form of legal association that 
                would give either party the express or implied right, power or authority to create any duty or obligation of the other party.
            </p>
            <p>
                <span className="L2Heading">17.12. Digital Millennium Copyright Act</span>. Pursuant to Title 17, United States Code, Section 
                512(c)(2), notifications of claimed copyright infringement should be sent to Autodesk's Copyright 
                Agent by email at CopyrightAgent@autodesk.com. For directions and more information about how to submit a claimed copyright notification, click 
                the following link: Copyright Information. INQUIRIES FAILING TO FOLLOW THIS PROCEDURE WILL NOT RECEIVE A RESPONSE.
            </p>
                
            <p  className="L1Heading">18. DEFINITIONS.</p>
            <p>Certain capitalized terms are defined in this Section, and others are defined contextually in these Terms.</p>

            <p>“Additional Consulting Services” means Technical Account Manager (TAM) services, premier or priority support or other services related to the 
                Online Services we provide to you under a contract for work or statement of work, and as identified in an Order. For the avoidance of doubt, 
                Additional Consulting Services do not include the standard level of support included in your Order.</p>

            <p>“Administrators” mean the personnel designated by you who administer the Online Services to End Users on your behalf.</p>

            <p>“Affiliate” means an entity which, directly or indirectly, owns or controls, is owned or is controlled by or is under common ownership or 
                control with a party, where “control” means the power to direct the management or affairs of an entity, and “ownership” means the beneficial 
                ownership of greater than 50% of the voting equity securities or other equivalent voting interests of the entity.</p>

            <p>“Online Services” means our hosted or online-based solutions (currently designated as “Online” deployments), including any client software we provide as part of the Online Services.</p>

            <p>“Documentation” means our standard published documentation for the Online Services, currently located here.</p>

            <p>“End User” means an individual you or an Affiliate permits or invites to use the Online Services. For the avoidance of doubt: (a) 
                individuals invited by your End Users, (b) individuals under managed accounts, and (c) individuals interacting with an Online 
                Service as Buyer or Seller are also considered End Users.</p>

            <p>“End User Account” means an account established by you or an End User to enable the End User to use or access the Online Service.</p>

            <p>“Feedback” means comments, questions, ideas, suggestions or other feedback relating to the Online Services, Support or Additional Services.</p>

            <p>“Laws” means all applicable local, state, federal and international laws, regulations and conventions, including those related to data privacy and data transfer, international communications and the exportation of technical or personal data.</p>

            <p>“Notification Email Address” means the email address(es) you used to register for Online Service account or otherwise sign up for 
                Online Service. It is your responsibility to keep your email address(es) valid and current so that we are able to send notices, statements, and other information to you.</p>

            <p>“Online Services” includes all websites owned or operated by AccuDiligence, and any related websites, sub-domains and pages, as well as any cloud-based services operated by AccuDiligence.</p>

            <p>“Order” means AccuDiligence applicable online order page(s), flows, in-product screens or other AccuDiligence-approved ordering document or process 
                describing the products and services you are ordering from us and, as applicable, their permitted scope of use. As applicable, the Order will identify: 
                (i) the Online Services, (ii) the number of End Users, Term, domain(s) associated with your use of Online Services, storage capacity or limits, or 
                other scope of use parameters and (iii) (for paid Orders) the amount or rate you will be charged, the billing terms, applicable currency, and form 
                of payment. Orders may also include Additional Consulting Services.</p>

            <p>“Our Deliverables” means any materials, deliverables, modifications, derivative works or developments that we provide in connection with an Order or any Additional Consulting Services.</p>

            <p>“Our Policies” means our Acceptable Use Policy, guidelines for Reporting Copyright and Trademark Violations, Online 
                Community Platforms Terms of Use, Privacy Policy, Support Policy, Support and Services Policy, and (unless specified) any other policies or terms referenced in these Terms.</p>

            <p>“Our Technology” means the Online Services, Our Deliverables, their “look and feel”, any and all related or underlying technology and any modifications or derivative works of the foregoing, including as they may incorporate Feedback.</p>

            <p>“PCI DSS” means the Payment Card Industry Data Security Standards.</p>

            <p>“PO” means a purchase order.</p>

            <p>“Product-Specific Terms” means additional terms that apply to certain Online Services and Additional Consulting Services, currently located here.</p>

            <p>“Sensitive Personal Information” means any (i) special categories of personal data enumerated in European Union Regulation 2016/679, Article 9(1) or any successor legislation; (ii) 
                patient, medical or other protected health information regulated by HIPAA; (iii) credit, debit or other payment card data subject to PCI DSS; (iv) other personal 
                information subject to regulation or protection under specific laws such as the Gramm-Leach-Bliley Act (or related rules or regulations); (v) social security 
                numbers, driver’s license numbers or other government ID numbers; or (vi) any data similar to the foregoing that is protected under foreign or domestic laws or regulations.</p>

            <p>“Support” means support for the Online Services, as further described in the Support and Services Policy (to the extent applicable). Your Support level will be specified in the applicable Order.</p>

            <p>“Data” means any data, content, code, video, images or other materials of any type that you (including any of your End Users or your Seller End Users) submit 
                to Online Services. In this context, “submit” (and any similar term) includes submitting, uploading, transmitting or otherwise making available your Data 
                to or through the Online Services. Data includes your Materials, meaning your systems, personnel or other resources.
                </p>
            <p> &nbsp; </p>
            <p className="L1Heading">Thank you for choosing AccuDiligence.</p>
        </div>
      );
    }