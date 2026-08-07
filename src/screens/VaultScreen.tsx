import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  ScrollView, ActivityIndicator, Alert, Platform, useColorScheme, FlatList, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const neonCyan = '#00F0FF';
const darkCyan = '#008B8B';
const neonMagenta = '#FF008A';

interface VaultFile {
  id: string;
  name: string;
  category: 'ACADEMIC' | 'TIMETABLE' | 'ADMISSIONS' | 'OTHERS';
  size: string;
  date: string;
  content?: string;
}

const DEFAULT_FILES: VaultFile[] = [
  {
    id: '1',
    name: 'NIT_Computer_Engineering_Syllabus.pdf',
    category: 'ACADEMIC',
    size: '2.4 MB',
    date: '2026-08-01',
    content: 'Full academic curriculum including Data Structures, Algorithms, and Microprocessors.'
  },
  {
    id: '2',
    name: 'Weekly_Timetable_Diploma_Semester3.pdf',
    category: 'TIMETABLE',
    size: '1.1 MB',
    date: '2026-08-04',
    content: 'Updated Semester 3 timetable containing Labs, Lectures, and Project hours.'
  },
  {
    id: '3',
    name: 'Admissions_Token_NEX-771823.txt',
    category: 'ADMISSIONS',
    size: '14 KB',
    date: '2026-08-07',
    content: 'GATEWAY TOKEN: NEX-771823\nCollege: Nexora Institute of Technology\nVerification: Verified Online Sync'
  }
];

const VAULT_CATEGORIES = ['ALL', 'ACADEMIC', 'TIMETABLE', 'ADMISSIONS', 'OTHERS'];

const VaultScreen = () => {
  const isDark = useColorScheme() === 'dark';
  const themeCyan = isDark ? neonCyan : darkCyan;
  
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('vault_files');
      if (stored) {
        setFiles(JSON.parse(stored));
      } else {
        await AsyncStorage.setItem('vault_files', JSON.stringify(DEFAULT_FILES));
        setFiles(DEFAULT_FILES);
      }
    } catch (e) {
      console.log('Error loading vault files:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveFilesToStorage = async (newFiles: VaultFile[]) => {
    try {
      await AsyncStorage.setItem('vault_files', JSON.stringify(newFiles));
    } catch (e) {
      console.log('Error saving vault files:', e);
    }
  };

  const handleSimulatedUpload = () => {
    Alert.alert(
      'UPLOAD DOCUMENT',
      'Select a document source to simulate upload:',
      [
        {
          text: 'Academic Syllabus (PDF)',
          onPress: () => uploadMockFile('Syllabus_Revised_Final.pdf', 'ACADEMIC', '1.8 MB', 'Syllabus revised node for engineering streams.')
        },
        {
          text: 'College Timetable (PDF)',
          onPress: () => uploadMockFile('College_Timetable_Sem4.pdf', 'TIMETABLE', '920 KB', 'Sem 4 timetable containing revised lab scheduling.')
        },
        {
          text: 'Admissions Token (TXT)',
          onPress: () => uploadMockFile(`Admissions_Token_NEX-${Math.floor(100000 + Math.random() * 900000)}.txt`, 'ADMISSIONS', '12 KB', 'Simulated admission node credentials.')
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const uploadMockFile = (name: string, category: any, size: string, content: string) => {
    setUploading(true);
    setTimeout(() => {
      const newFile: VaultFile = {
        id: Math.random().toString(),
        name,
        category,
        size,
        date: new Date().toISOString().split('T')[0],
        content
      };
      const updatedFiles = [newFile, ...files];
      setFiles(updatedFiles);
      saveFilesToStorage(updatedFiles);
      setUploading(false);
      Alert.alert('VAULT GATEWAY SECURED', `"${name}" has been encrypted and added to your secure document locker.`);
    }, 1500);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'DELETE FILE',
      `Are you sure you want to permanently erase "${name}" from your vault locker?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'ERASE NODE', 
          style: 'destructive',
          onPress: () => {
            const updatedFiles = files.filter(f => f.id !== id);
            setFiles(updatedFiles);
            saveFilesToStorage(updatedFiles);
          }
        }
      ]
    );
  };

  const handleSendToWhatsApp = (file: VaultFile) => {
    Alert.alert(
      'WHATSAPP EXPORT NODE',
      `Forwarding "${file.name}" to your connected WhatsApp phone node.\n\nContinue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'TRANSMIT',
          onPress: () => {
            Alert.alert(
              'TRANSMISSION SUCCESS',
              `Document payload forwarded successfully. Timetable updates/tokens synchronized on your WhatsApp client.`
            );
          }
        }
      ]
    );
  };

  const getFilteredFiles = () => {
    return files.filter(file => {
      const matchesCategory = activeCategory === 'ALL' || file.category === activeCategory;
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            file.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'ACADEMIC': return '#FF8A00';
      case 'TIMETABLE': return '#00F0FF';
      case 'ADMISSIONS': return '#FF008A';
      default: return '#AF52DE';
    }
  };

  // Calculate simulated storage footprint
  const totalSizeMB = files.reduce((acc, f) => {
    const isKB = f.size.includes('KB');
    const val = parseFloat(f.size);
    return acc + (isKB ? val / 1024 : val);
  }, 0).toFixed(1);

  const storagePercentage = Math.min(100, (parseFloat(totalSizeMB) / 512) * 100);

  return (
    <View style={styles.container}>
      <LinearGradient colors={isDark ? ['#020205', '#0A0515', '#020205'] : ['#F4F6F9', '#ECEFF4', '#F4F6F9']} style={styles.background} />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DOCUMENT VAULT</Text>
          <Text style={styles.subtitle}>Secure Storage Chamber for College Nodes</Text>
        </View>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleSimulatedUpload}>
          <Ionicons name="cloud-upload" size={20} color={isDark ? '#000' : '#FFF'} />
          <Text style={styles.uploadBtnText}>ADD FILE</Text>
        </TouchableOpacity>
      </View>

      {/* STORAGE FOOTPRINT METER */}
      <View style={[styles.storageMeter, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        <View style={styles.storageLabelRow}>
          <View style={styles.flexRow}>
            <Ionicons name="pie-chart" size={16} color={themeCyan} style={{ marginRight: 8 }} />
            <Text style={[styles.storageText, { color: isDark ? '#FFF' : '#333' }]}>Storage Space Used</Text>
          </View>
          <Text style={[styles.storagePercentText, { color: themeCyan }]}>{totalSizeMB} MB / 512 MB</Text>
        </View>
        <View style={[styles.barBg, { backgroundColor: isDark ? '#111' : '#E2E8F0' }]}>
          <View style={[styles.barFill, { width: `${storagePercentage}%`, backgroundColor: themeCyan }]} />
        </View>
      </View>

      {/* SEARCH INPUT */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : '#FFF' }]}>
          <Ionicons name="search" size={18} color="rgba(120, 120, 120, 0.6)" />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFF' : '#000' }]}
            placeholder="Search vault files by keyword..."
            placeholderTextColor="rgba(120, 120, 120, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={18} color="rgba(120, 120, 120, 0.6)" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* CATEGORY CHIPS */}
      <View style={styles.categorySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {VAULT_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                  isActive && { borderColor: themeCyan, backgroundColor: isDark ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0, 139, 139, 0.1)' }
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.catChipText, isActive && { color: themeCyan }]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* UPLOADING STATE INDICATOR */}
      {uploading && (
        <View style={styles.uploadingBox}>
          <ActivityIndicator size="small" color={themeCyan} />
          <Text style={[styles.uploadingText, { color: themeCyan }]}>Encrypting data packets & syncing cloud nodes...</Text>
        </View>
      )}

      {/* FILES FLAT LIST */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themeCyan} />
          <Text style={[styles.loaderText, { color: themeCyan }]}>Accessing Secure Encryption Hub...</Text>
        </View>
      ) : getFilteredFiles().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shield-half" size={60} color="rgba(120, 120, 120, 0.2)" />
          <Text style={[styles.emptyText, { color: isDark ? 'rgba(255,255,255,0.3)' : '#888' }]}>Locker is empty or query has no matches.</Text>
          <TouchableOpacity style={styles.addMockBtn} onPress={handleSimulatedUpload}>
            <Text style={[styles.addMockBtnText, { color: themeCyan }]}>INITIALIZE SIMULATED LOCKER</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={getFilteredFiles()}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.fileList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const catColor = getCategoryColor(item.category);
            return (
              <View style={[styles.fileCard, { backgroundColor: isDark ? 'rgba(15, 15, 35, 0.6)' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)' }]}>
                
                {/* File Summary */}
                <View style={styles.fileHeader}>
                  <View style={[styles.fileIconBox, { backgroundColor: catColor + '18' }]}>
                    <Ionicons 
                      name={item.category === 'ACADEMIC' ? "school" : item.category === 'TIMETABLE' ? "time" : "keypad"} 
                      size={22} 
                      color={catColor} 
                    />
                  </View>
                  <View style={styles.fileMeta}>
                    <Text style={[styles.fileName, { color: isDark ? '#FFF' : '#111' }]} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.tagRow}>
                      <Text style={[styles.fileSize, { color: isDark ? 'rgba(255,255,255,0.3)' : '#888' }]}>{item.size} • {item.date}</Text>
                      <View style={[styles.catBadge, { backgroundColor: catColor + '20', borderColor: catColor + '40' }]}>
                        <Text style={[styles.catBadgeText, { color: catColor }]}>{item.category}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* File preview content */}
                {item.content && (
                  <View style={[styles.previewContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#F9FBFC' }]}>
                    <Text style={[styles.previewText, { color: isDark ? 'rgba(255,255,255,0.5)' : '#555' }]} numberOfLines={3}>{item.content}</Text>
                  </View>
                )}

                {/* File Action Row */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleSendToWhatsApp(item)}>
                    <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                    <Text style={styles.actionBtnText}>WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionBtn} 
                    onPress={() => Alert.alert('DOCUMENT BRIEF', item.content || 'No text content available.')}
                  >
                    <Ionicons name="eye-outline" size={16} color={themeCyan} />
                    <Text style={[styles.actionBtnText, { color: themeCyan }]}>Preview</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.name)}>
                    <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                    <Text style={styles.actionBtnText}>Erase</Text>
                  </TouchableOpacity>
                </View>

              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: Platform.OS === 'ios' ? 70 : 50, 
    paddingBottom: 15 
  },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: 2, color: '#FFF', textShadowColor: neonCyan, textShadowRadius: 8 },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5, fontWeight: 'bold' },
  uploadBtn: { 
    flexDirection: 'row', 
    backgroundColor: neonCyan, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: neonCyan,
    shadowRadius: 8,
    shadowOpacity: 0.3
  },
  uploadBtnText: { color: '#000', fontSize: 10, fontWeight: '900', marginLeft: 6 },
  
  storageMeter: { marginHorizontal: 20, padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 15 },
  storageLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  flexRow: { flexDirection: 'row', alignItems: 'center' },
  storageText: { fontSize: 12, fontWeight: '800' },
  storagePercentText: { fontSize: 12, fontWeight: '900' },
  barBg: { height: 6, width: '100%', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  
  searchSection: { paddingHorizontal: 20, marginBottom: 12 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 14, 
    paddingHorizontal: 15, 
    height: 48, 
    borderWidth: 1, 
    borderColor: 'rgba(120, 120, 120, 0.15)' 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 13 },
  
  categorySection: { marginBottom: 15 },
  categoryScroll: { paddingHorizontal: 20 },
  catChip: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 12, 
    borderWidth: 1, 
    marginRight: 8 
  },
  catChipText: { color: 'rgba(120, 120, 120, 0.6)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  uploadingBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    padding: 12, 
    backgroundColor: 'rgba(0, 240, 255, 0.05)', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(0, 240, 255, 0.15)', 
    marginBottom: 15 
  },
  uploadingText: { fontSize: 10, fontWeight: '700', marginLeft: 10 },
  
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginTop: 15 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  addMockBtn: { backgroundColor: 'rgba(0, 240, 255, 0.08)', borderWidth: 1, borderColor: neonCyan + '44', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  addMockBtnText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  
  fileList: { paddingHorizontal: 20, paddingBottom: 150 },
  fileCard: { 
    borderRadius: 20, 
    borderWidth: 1, 
    padding: 15, 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2
  },
  fileHeader: { flexDirection: 'row', alignItems: 'center' },
  fileIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  fileMeta: { flex: 1, marginLeft: 12 },
  fileName: { fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  fileSize: { fontSize: 11 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 10, borderWidth: 1 },
  catBadgeText: { fontSize: 8, fontWeight: '900' },
  
  previewContainer: { padding: 12, borderRadius: 10, marginVertical: 12 },
  previewText: { fontSize: 11.5, lineHeight: 16 },
  
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(120, 120, 120, 0.06)', 
    paddingTop: 10,
    marginTop: 8
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 6 },
  actionBtnText: { color: 'rgba(120, 120, 120, 0.6)', fontSize: 10, fontWeight: '900', marginLeft: 6 }
});

export default VaultScreen;
