import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { format, isSameDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'personal' | 'urgent' | 'idea';
  date: Date;
  hasNotification: boolean;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  description: string;
  color: string;
}

const categoryColors = {
  work: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  personal: 'bg-gradient-to-r from-purple-500 to-pink-500',
  urgent: 'bg-gradient-to-r from-orange-500 to-red-500',
  idea: 'bg-gradient-to-r from-green-500 to-emerald-500',
};

const categoryIcons = {
  work: 'Briefcase',
  personal: 'User',
  urgent: 'AlertCircle',
  idea: 'Lightbulb',
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<'notes' | 'calendar' | 'events'>('notes');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Презентация проекта',
      description: 'Подготовить слайды для встречи с клиентом',
      category: 'work',
      date: new Date(),
      hasNotification: true,
    },
    {
      id: '2',
      title: 'Тренировка',
      description: 'Вечерняя пробежка в парке',
      category: 'personal',
      date: addDays(new Date(), 1),
      hasNotification: true,
    },
  ]);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Встреча с командой',
      date: new Date(),
      time: '14:00',
      description: 'Обсуждение нового проекта',
      color: '#9b87f5',
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '', category: 'work' as Note['category'] });
  const [newEvent, setNewEvent] = useState({ title: '', time: '', description: '', color: '#9b87f5' });

  const handleAddNote = () => {
    if (!newNote.title) return;
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      description: newNote.description,
      category: newNote.category,
      date: selectedDate || new Date(),
      hasNotification: true,
    };
    setNotes([...notes, note]);
    setNewNote({ title: '', description: '', category: 'work' });
    setIsAddDialogOpen(false);
    toast.success('Заметка добавлена!', {
      description: 'Уведомление будет отправлено за 1 час до времени',
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate || new Date(),
      time: newEvent.time,
      description: newEvent.description,
      color: newEvent.color,
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', time: '', description: '', color: '#9b87f5' });
    setIsAddDialogOpen(false);
    toast.success('Событие создано!', {
      description: 'Напоминание придёт за 30 минут',
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.success('Заметка удалена');
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success('Событие удалено');
  };

  const filteredNotes = selectedDate
    ? notes.filter((note) => isSameDay(note.date, selectedDate))
    : notes;

  const filteredEvents = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : events;

  const getDayEvents = (day: Date) => {
    return [...notes, ...events].filter((item) => isSameDay(item.date, day));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Календарь Заметок
          </h1>
          <p className="text-gray-600 text-lg">Организуй свою жизнь креативно</p>
        </div>

        <div className="flex gap-3 mb-8 justify-center flex-wrap">
          {[
            { id: 'notes', label: 'Заметки', icon: 'StickyNote' },
            { id: 'calendar', label: 'Календарь', icon: 'Calendar' },
            { id: 'events', label: 'События', icon: 'Sparkles' },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                relative px-8 py-6 text-lg font-medium rounded-2xl transition-all duration-300 hover-scale
                ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }
              `}
            >
              <Icon name={tab.icon as any} className="mr-2 inline" size={20} />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full animate-pulse"></span>
              )}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'notes' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Мои заметки</h2>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-6 shadow-lg">
                        <Icon name="Plus" className="mr-2" size={18} />
                        Добавить
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Новая заметка
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Input
                          placeholder="Название"
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                          className="rounded-xl border-2"
                        />
                        <Textarea
                          placeholder="Описание"
                          value={newNote.description}
                          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                          className="rounded-xl border-2"
                          rows={4}
                        />
                        <Select
                          value={newNote.category}
                          onValueChange={(value) => setNewNote({ ...newNote, category: value as Note['category'] })}
                        >
                          <SelectTrigger className="rounded-xl border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="work">🏢 Работа</SelectItem>
                            <SelectItem value="personal">👤 Личное</SelectItem>
                            <SelectItem value="urgent">⚡ Срочно</SelectItem>
                            <SelectItem value="idea">💡 Идея</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddNote} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-lg py-6">
                          <Icon name="Check" className="mr-2" size={20} />
                          Создать заметку
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {filteredNotes.length === 0 ? (
                  <Card className="p-12 text-center rounded-3xl border-2 border-dashed">
                    <Icon name="FileText" size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Заметок пока нет. Создай первую!</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredNotes.map((note) => (
                      <Card
                        key={note.id}
                        className="p-6 rounded-3xl hover-scale border-l-8 transition-all duration-300 hover:shadow-xl"
                        style={{ borderLeftColor: categoryColors[note.category].split(' ')[1].match(/\w+-\d+/)?.[0] || '#9b87f5' }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-xl ${categoryColors[note.category]} text-white`}>
                                <Icon name={categoryIcons[note.category] as any} size={20} />
                              </div>
                              <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-3">{note.description}</p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="secondary" className="rounded-lg">
                                <Icon name="Calendar" size={14} className="mr-1" />
                                {format(note.date, 'd MMMM', { locale: ru })}
                              </Badge>
                              {note.hasNotification && (
                                <Badge className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                                  <Icon name="Bell" size={14} className="mr-1" />
                                  Уведомление включено
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNote(note.id)}
                            className="rounded-xl hover:bg-red-50 hover:text-red-600"
                          >
                            <Icon name="Trash2" size={20} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendar' && (
              <Card className="p-8 rounded-3xl animate-fade-in shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Календарь</h2>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ru}
                  className="rounded-2xl border-0"
                  modifiers={{
                    hasEvents: (date) => getDayEvents(date).length > 0,
                  }}
                  modifiersStyles={{
                    hasEvents: {
                      backgroundColor: '#9b87f5',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                    },
                  }}
                />
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Icon name="Info" size={16} />
                    Дни с событиями выделены фиолетовым
                  </p>
                </div>
              </Card>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">События</h2>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl px-6 shadow-lg">
                        <Icon name="Plus" className="mr-2" size={18} />
                        Создать
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                          Новое событие
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Input
                          placeholder="Название события"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="rounded-xl border-2"
                        />
                        <Input
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          className="rounded-xl border-2"
                        />
                        <Textarea
                          placeholder="Описание"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          className="rounded-xl border-2"
                          rows={3}
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Цвет события</label>
                          <div className="flex gap-3">
                            {['#9b87f5', '#D946EF', '#F97316', '#0EA5E9', '#10B981'].map((color) => (
                              <button
                                key={color}
                                onClick={() => setNewEvent({ ...newEvent, color })}
                                className={`w-12 h-12 rounded-xl transition-transform hover:scale-110 ${
                                  newEvent.color === color ? 'ring-4 ring-gray-400' : ''
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <Button onClick={handleAddEvent} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-lg py-6">
                          <Icon name="Check" className="mr-2" size={20} />
                          Создать событие
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {filteredEvents.length === 0 ? (
                  <Card className="p-12 text-center rounded-3xl border-2 border-dashed">
                    <Icon name="CalendarDays" size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Событий пока нет. Создай первое!</p>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="p-6 rounded-3xl hover-scale transition-all duration-300 hover:shadow-xl border-l-8"
                        style={{ borderLeftColor: event.color }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="p-3 rounded-xl text-white"
                                style={{ backgroundColor: event.color }}
                              >
                                <Icon name="Sparkles" size={20} />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                  <Icon name="Clock" size={14} />
                                  {event.time}
                                </p>
                              </div>
                            </div>
                            {event.description && (
                              <p className="text-gray-600 mb-3">{event.description}</p>
                            )}
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="rounded-lg">
                                <Icon name="Calendar" size={14} className="mr-1" />
                                {format(event.date, 'd MMMM', { locale: ru })}
                              </Badge>
                              <Badge className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                                <Icon name="Bell" size={14} className="mr-1" />
                                За 30 минут
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteEvent(event.id)}
                            className="rounded-xl hover:bg-red-50 hover:text-red-600"
                          >
                            <Icon name="Trash2" size={20} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-white to-purple-50 animate-fade-in">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Icon name="Calendar" size={20} className="text-purple-600" />
                Выбранная дата
              </h3>
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl">
                    <p className="text-3xl font-bold">{format(selectedDate, 'd')}</p>
                    <p className="text-sm uppercase tracking-wider">{format(selectedDate, 'MMMM yyyy', { locale: ru })}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-purple-100 rounded-xl">
                      <span className="text-sm font-medium">Заметок</span>
                      <Badge className="bg-purple-600">{filteredNotes.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-100 rounded-xl">
                      <span className="text-sm font-medium">Событий</span>
                      <Badge className="bg-orange-600">{filteredEvents.length}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Выберите дату</p>
              )}
            </Card>

            <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-white to-orange-50 animate-fade-in">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-orange-600" />
                Статистика
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
                  <p className="text-sm text-gray-700 mb-1">Всего заметок</p>
                  <p className="text-3xl font-bold text-blue-700">{notes.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl">
                  <p className="text-sm text-gray-700 mb-1">Всего событий</p>
                  <p className="text-3xl font-bold text-purple-700">{events.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
                  <p className="text-sm text-gray-700 mb-1">Активных уведомлений</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {notes.filter((n) => n.hasNotification).length + events.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 animate-fade-in">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="Bell" size={20} className="text-green-600" />
                Система уведомлений
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-sm">Заметки</p>
                    <p className="text-xs text-gray-600">За 1 час до времени</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-sm">События</p>
                    <p className="text-xs text-gray-600">За 30 минут</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-sm">Срочные задачи</p>
                    <p className="text-xs text-gray-600">Мгновенно</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
