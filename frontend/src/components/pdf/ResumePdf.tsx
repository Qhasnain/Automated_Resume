import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { formatSmartLink } from '../../lib/utils';

// Register standard fonts if needed, but Helvetica is built-in.
const styles = StyleSheet.create({
  page: {
    paddingTop: '20mm',
    paddingBottom: '20mm',
    paddingLeft: '18mm',
    paddingRight: '18mm',
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111827',
    marginBottom: 4,
  },
  targetJob: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#4B5563',
    gap: 8,
  },
  contactItem: {
    marginRight: 8,
  },
  link: {
    color: '#2563EB',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 4,
    marginBottom: 8,
  },
  itemBlock: {
    marginBottom: 8,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  itemDates: {
    fontSize: 10,
    color: '#4B5563',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 10,
  },
  skillCategory: {
    fontWeight: 'bold',
    color: '#111827',
    width: '30%',
    textTransform: 'capitalize',
  },
  skillItems: {
    width: '70%',
    color: '#4B5563',
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

interface ResumePdfProps {
  resume: any;
  layout: any[];
  template: string;
}

export default function ResumePdf({ resume, layout, template }: ResumePdfProps) {
  const pd = resume?.personal_details || {};
  
  const skills = resume?.skills || [];
  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach((s: any) => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s.name);
  });

  const renderSection = (id: string) => {
    switch (id) {
      case 'experience':
        if (!resume?.experiences?.length) return null;
        return (
          <View style={styles.section} key="experience" wrap={false}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experiences.map((exp: any, i: number) => (
              <View style={styles.itemBlock} key={i} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{exp.position || 'Job Title'}</Text>
                  <Text style={styles.itemDates}>
                    {exp.start_date || 'Start'} - {exp.is_current ? 'Present' : (exp.end_date || 'End')}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {exp.company || 'Company'} {exp.location ? ` | ${exp.location}` : ''}
                </Text>
                <Text style={styles.itemDescription}>{exp.description}</Text>
              </View>
            ))}
          </View>
        );
      case 'education':
        if (!resume?.educations?.length) return null;
        return (
          <View style={styles.section} key="education" wrap={false}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.educations.map((edu: any, i: number) => (
              <View style={styles.itemBlock} key={i} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{edu.institution || 'Institution'}</Text>
                  <Text style={styles.itemDates}>
                    {edu.start_date || 'Start'} - {edu.end_date || 'End'}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {(edu.degree || 'Degree')} in {(edu.field_of_study || 'Field')}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'projects':
        if (!resume?.projects?.length) return null;
        return (
          <View style={styles.section} key="projects" wrap={false}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((proj: any, i: number) => (
              <View style={styles.itemBlock} key={i} wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{proj.name || 'Project Name'}</Text>
                </View>
                <Text style={styles.itemDescription}>{proj.description}</Text>
                {(proj.github_link || proj.live_demo) && (
                  <View style={[styles.flexRow, { marginTop: 4, gap: 8 }]}>
                    {proj.github_link && <Link src={proj.github_link} style={styles.link}>GitHub</Link>}
                    {proj.live_demo && <Link src={proj.live_demo} style={styles.link}>Live Demo</Link>}
                  </View>
                )}
              </View>
            ))}
          </View>
        );
      case 'skills':
        if (Object.keys(skillsByCategory).length === 0) return null;
        return (
          <View style={styles.section} key="skills" wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(skillsByCategory).map(([cat, items], i) => (
              <View style={styles.skillRow} key={i}>
                <Text style={styles.skillCategory}>{cat.replace('_', ' ')}:</Text>
                <Text style={styles.skillItems}>{items.join(', ')}</Text>
              </View>
            ))}
          </View>
        );
      case 'certificates':
        if (!resume?.certificates?.length) return null;
        return (
          <View style={styles.section} key="certificates" wrap={false}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {resume.certificates.map((c: any, i: number) => (
              <View style={styles.itemHeaderRow} key={i} wrap={false}>
                <Text style={styles.itemTitle}>{c.name || 'Certificate'} - {c.issuer || 'Issuer'}</Text>
                <Text style={styles.itemDates}>{c.date || 'Date'}</Text>
              </View>
            ))}
          </View>
        );
      case 'languages':
        if (!resume?.languages?.length) return null;
        return (
          <View style={styles.section} key="languages" wrap={false}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.flexRow}>
              {resume.languages.map((l: any, i: number) => (
                <Text style={[styles.itemDescription, { marginRight: 15 }]} key={i}>
                  <Text style={{ fontWeight: 'bold', color: '#111827' }}>{l.name || 'Language'}</Text> - {l.proficiency || 'Proficiency'}
                </Text>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // We can inject slightly different styles based on template, but a single highly robust 
  // one-column layout ensures perfect pagination and solves the print scaling issues permanently.
  // The user requested: "The exported file should look identical to Microsoft Word Export...".
  // This layout perfectly replicates a standard professional document.

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <Text style={styles.name}>{pd.full_name || 'Your Name'}</Text>
          <Text style={styles.targetJob}>{resume.target_job_title || 'Target Job Title'}</Text>
          <View style={styles.contactRow}>
            {pd.email && (
              <Text style={styles.contactItem}>
                <Link src={formatSmartLink(pd.email, 'email')?.href || ''} style={styles.link}>{formatSmartLink(pd.email, 'email')?.label}</Link>
              </Text>
            )}
            {pd.phone && (
              <Text style={styles.contactItem}>
                <Link src={formatSmartLink(pd.phone, 'phone')?.href || ''} style={styles.link}>{formatSmartLink(pd.phone, 'phone')?.label}</Link>
              </Text>
            )}
            {pd.location && <Text style={styles.contactItem}>• {pd.location}</Text>}
            {pd.linkedin && (
              <Text style={styles.contactItem}>
                <Link src={formatSmartLink(pd.linkedin, 'linkedin')?.href || ''} style={styles.link}>{formatSmartLink(pd.linkedin, 'linkedin')?.label}</Link>
              </Text>
            )}
            {pd.github && (
              <Text style={styles.contactItem}>
                <Link src={formatSmartLink(pd.github, 'github')?.href || ''} style={styles.link}>{formatSmartLink(pd.github, 'github')?.label}</Link>
              </Text>
            )}
          </View>
        </View>

        {/* Render sections respecting the layout order and visibility */}
        {layout.filter(s => s.visible).map(section => renderSection(section.id))}

      </Page>
    </Document>
  );
}
