import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { COLORS, DEFAULT_TEMPLATES } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../context/TimerContext';

interface TemplatesScreenProps {
  navigation: any;
}

interface LocalTemplate {
  id: string;
  name: string;
  work_duration: number;
  rest_duration: number;
  rounds: number;
  sets: number;
  set_rest_duration: number;
}

export const TemplatesScreen = ({ navigation }: TemplatesScreenProps) => {
  const { setConfig, setSelectedTemplateName, selectedTemplateName } = useTimerContext();
  const [showCreate, setShowCreate] = useState(false);
  const [templates] = useState<LocalTemplate[]>(
    DEFAULT_TEMPLATES.map((t, i) => ({ ...t, id: `default-${i}` }))
  );
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    work_duration: '20',
    rest_duration: '10',
    rounds: '8',
    sets: '1',
    set_rest_duration: '60',
  });

  const handleSelectTemplate = (template: LocalTemplate) => {
    setConfig({
      workDuration: template.work_duration,
      restDuration: template.rest_duration,
      rounds: template.rounds,
      sets: template.sets,
      setRestDuration: template.set_rest_duration,
    });
    setSelectedTemplateName(template.name);
    navigation.goBack();
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      return;
    }
    const template: LocalTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      work_duration: parseInt(newTemplate.work_duration) || 20,
      rest_duration: parseInt(newTemplate.rest_duration) || 10,
      rounds: parseInt(newTemplate.rounds) || 8,
      sets: parseInt(newTemplate.sets) || 1,
      set_rest_duration: parseInt(newTemplate.set_rest_duration) || 60,
    };
    handleSelectTemplate(template);
    setShowCreate(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>训练模板</Text>
        <TouchableOpacity onPress={() => setShowCreate(!showCreate)}>
          <Ionicons name={showCreate ? 'close' : 'add'} size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>自定义模板</Text>
          <TextInput
            style={styles.input}
            placeholder="模板名称"
            placeholderTextColor={COLORS.textSecondary}
            value={newTemplate.name}
            onChangeText={(text) => setNewTemplate({ ...newTemplate, name: text })}
          />
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>运动(秒)</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="number-pad"
                value={newTemplate.work_duration}
                onChangeText={(text) => setNewTemplate({ ...newTemplate, work_duration: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>休息(秒)</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="number-pad"
                value={newTemplate.rest_duration}
                onChangeText={(text) => setNewTemplate({ ...newTemplate, rest_duration: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>轮数</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="number-pad"
                value={newTemplate.rounds}
                onChangeText={(text) => setNewTemplate({ ...newTemplate, rounds: text })}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTemplate}>
            <Text style={styles.createButtonText}>使用此配置</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.list}>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplateName === template.name && styles.templateCardSelected,
            ]}
            onPress={() => handleSelectTemplate(template)}
          >
            <View style={styles.templateInfo}>
              <View style={styles.templateHeader}>
                <Text style={styles.templateName}>{template.name}</Text>
                {selectedTemplateName === template.name && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.templateDetails}>
                {template.work_duration}s 运动 / {template.rest_duration}s 休息 × {template.rounds} 轮
                {template.sets > 1 && ` × ${template.sets} 组`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  createForm: {
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  inputSmall: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  templateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: COLORS.primary,
  },
  templateInfo: {
    flex: 1,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  templateDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
