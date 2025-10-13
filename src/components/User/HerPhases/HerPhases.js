import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ArrowBack, ArrowForward, KeyboardArrowDown, KeyboardArrowUp, Analytics } from '@mui/icons-material';
import { herPhasesService } from '../../../services/User/HerPhases/her-phases.service';

function formatDisplayDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const monthName = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

function toYmd(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function toDdMmYyyy(date) {
  const d = new Date(date);
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parseDdMmYyyy(s) {
  // s in DD-MM-YYYY
  if (!s) return null;
  const [dd, mm, yyyy] = s.split('-').map(v => parseInt(v, 10));
  if (!yyyy || !mm || !dd) return null;
  return new Date(yyyy, mm - 1, dd);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function normalizeYmd(date) {
  return toYmd(date);
}

// Predict 3 cycles like Flutter viewmodel (inputs: lastPeriod in DD-MM-YYYY)
function predictCycle3Months({ name, lastPeriodDisplay, cycleLength }) {
  const lastPeriod = parseDdMmYyyy(lastPeriodDisplay);
  if (!lastPeriod) return [];
  const results = [];
  for (let i = 1; i <= 3; i++) {
    const nextPeriod = addDays(lastPeriod, cycleLength * i);
    const ovulation = addDays(nextPeriod, -14);
    const cycleStartForThis = addDays(lastPeriod, cycleLength * (i - 1));
    results.push({
      userName: name,
      lastPeriodDate: lastPeriodDisplay,
      cycleLength,
      cycleStartDate: formatDisplayDate(cycleStartForThis),
      nextPeriodDate: formatDisplayDate(nextPeriod),
      ovulationDate: formatDisplayDate(ovulation),
      cycle: i,
      month: nextPeriod.toLocaleString('en-US', { month: 'long' }),
      cycleStartDateTime: cycleStartForThis,
      nextPeriodDateTime: nextPeriod,
      ovulationDateTime: ovulation,
    });
  }
  return results;
}

// Build events map as per Flutter viewmodel getAllEvents
function buildEventsFromPredictions(predictions, lastPeriodDisplay) {
  const events = {};
  const lastPeriod = parseDdMmYyyy(lastPeriodDisplay);
  if (!lastPeriod) return events;

  // Show ONLY the user-entered lastPeriodDate (in its month)
  events[normalizeYmd(lastPeriod)] = 'Period';

  // Add predictions ONLY for future cycles (not the same month as last period)
  for (const p of predictions) {
    const nextPeriod = p.nextPeriodDateTime;
    const ovulation = p.ovulationDateTime;
    if (nextPeriod.getFullYear() === lastPeriod.getFullYear() && nextPeriod.getMonth() === lastPeriod.getMonth()) {
      continue;
    }
    // Period 5 days starting from next period
    for (let i = 0; i < 5; i++) {
      const d = addDays(nextPeriod, i);
      events[normalizeYmd(d)] = 'Period';
    }
    // Pre-Period: 2 days before
    for (let i = 2; i >= 1; i--) {
      const d = addDays(nextPeriod, -i);
      events[normalizeYmd(d)] = 'Pre-Period';
    }
    // Peak Ovulation
    events[normalizeYmd(ovulation)] = 'Peak Ovulation';
    // Fertile window: ovulation-4 to ovulation+1, excluding ovulation itself
    const fertileStart = addDays(ovulation, -4);
    const fertileEnd = addDays(ovulation, 1);
    let cur = new Date(fertileStart);
    while (cur <= fertileEnd) {
      if (normalizeYmd(cur) !== normalizeYmd(ovulation)) {
        events[normalizeYmd(cur)] = 'Fertile';
      }
      cur = addDays(cur, 1);
    }
  }
  return events;
}

function computeFocusedDay(predictions, lastPeriodDisplay) {
  if (predictions && predictions.length > 0) {
    return predictions[0].nextPeriodDateTime;
  }
  const last = parseDdMmYyyy(lastPeriodDisplay);
  return last || new Date();
}

function monthMatrix(focusedDate) {
  const first = startOfMonth(focusedDate);
  const last = endOfMonth(focusedDate);
  const startWeekday = first.getDay(); // 0 Sun - 6 Sat
  const daysInMonth = last.getDate();

  const grid = [];
  let current = 1 - startWeekday; // start from Sunday of the first week row
  for (let week = 0; week < 6; week++) {
    const row = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(first.getFullYear(), first.getMonth(), current);
      row.push(date);
      current++;
    }
    grid.push(row);
  }
  return grid;
}

const colorPalette = {
  header: '#3f51b5',
  period: '#FF6B6B',
  prePeriod: '#29B6F6',
  postPeriod: '#6C5CE7',
  ovulation: '#FFA726',
  fertile: '#66BB6A',
  today: '#9FA8DA'
};

export default function HerPhases() {
  const [name, setName] = useState('');
  const [lastPeriodDisplay, setLastPeriodDisplay] = useState(''); // DD-MM-YYYY
  const [lastPeriodISO, setLastPeriodISO] = useState(''); // YYYY-MM-DD for native input
  const [cycleLength, setCycleLength] = useState('28');
  const [consent, setConsent] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const [focusedDate, setFocusedDate] = useState(new Date());
  const [eventsMap, setEventsMap] = useState({});
  const [hasResults, setHasResults] = useState(false);
  const [highlightedCategory, setHighlightedCategory] = useState(null);
  const [highlightToday, setHighlightToday] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calendarRef = useRef(null);
  const legendRef = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setIsAtBottom(el.scrollTop >= max - 24);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const calendarGrid = useMemo(() => monthMatrix(focusedDate), [focusedDate]);

  function getEventLabel(date) {
    return eventsMap[normalizeYmd(date)];
  }

  function getEventColor(label) {
    switch (label) {
      case 'Period':
      case 'Last Period':
        return colorPalette.period;
      case 'Pre-Period':
        return colorPalette.prePeriod;
      case 'Post Period':
        return colorPalette.postPeriod;
      case 'Peak Ovulation':
        return colorPalette.ovulation;
      case 'Fertile':
        return colorPalette.fertile;
      default:
        return undefined;
    }
  }

  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  async function handlePredict() {
    if (!name || !lastPeriodDisplay || !cycleLength) {
      window.alert('All mandatory fields are required.');
      return;
    }

    const cycle = Math.max(20, Math.min(40, parseInt(cycleLength, 10) || 28));
    const predictions = predictCycle3Months({ name, lastPeriodDisplay, cycleLength: cycle });
    const events = buildEventsFromPredictions(predictions, lastPeriodDisplay);

    setEventsMap(events);
    setHasResults(true);

    // Focus as per viewmodel
    const focus = computeFocusedDay(predictions, lastPeriodDisplay);
    setFocusedDate(new Date(focus.getFullYear(), focus.getMonth(), 1));

    // Scroll to calendar
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    // Prepare API payload
    // Use first prediction for API payload dates (as in Dart)
    const first = predictions[0];
    const lastISO = (() => {
      const d = parseDdMmYyyy(lastPeriodDisplay);
      return d ? toYmd(d) : lastPeriodISO;
    })();
    const payload = {
      user_name: name,
      phone_number: phone?.trim() || undefined,
      email_id: email?.trim() || undefined,
      last_period_date: lastISO,
      cycle_length: cycle,
      cycle_start_date: first?.cycleStartDate,
      next_period_date: first?.nextPeriodDate,
      ovulation_date: first?.ovulationDate,
    };

    setSubmitting(true);
    try {
      const resp = await herPhasesService.createPhase(payload);
      if (!resp.success) {
        console.warn('Failed to save phase:', resp.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function CalendarHeader() {
    const title = focusedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, backgroundColor: colorPalette.header }}>
        <IconButton size="small" onClick={() => setFocusedDate(new Date(focusedDate.getFullYear(), focusedDate.getMonth() - 1, 1))}>
          <ArrowBack sx={{ color: '#fff' }} />
        </IconButton>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 18 }}>{title}</Typography>
        <IconButton size="small" onClick={() => setFocusedDate(new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1, 1))}>
          <ArrowForward sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
    );
  }

  function WeekdayRow() {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 1.5, py: 1, gap: 0.5 }}>
        {labels.map(l => (
          <Typography key={l} sx={{ textAlign: 'center', color: '#666', fontWeight: 600, fontSize: 14 }}>{l}</Typography>
        ))}
      </Box>
    );
  }

  function CalendarGrid() {
    const today = new Date();
    return (
      <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(6, 1fr)', px: 1.5, pb: 2 }}>
        {calendarGrid.map((week, wi) => (
          <Box key={wi} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, my: 0.5 }}>
            {week.map((date, di) => {
              const inMonth = date.getMonth() === focusedDate.getMonth();
              const eventLabel = getEventLabel(date);
              const color = getEventColor(eventLabel);
              const isToday = isSameDay(date, today);
              const isHighlighted = highlightedCategory && highlightedCategory === eventLabel;
              const todayEmphasis = isToday && highlightToday;
              const fillColor = isToday ? colorPalette.today : color;

              return (
                <Box key={`${wi}-${di}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 44 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: fillColor ? fillColor : 'transparent',
                      border: isHighlighted ? `3px solid ${colorPalette.header}` : (todayEmphasis ? `2px solid ${colorPalette.today}` : 'none'),
                      boxShadow: fillColor ? `0 2px 6px ${fillColor}44` : 'none',
                      opacity: inMonth ? 1 : 0.5
                    }}
                  >
                    <Typography sx={{ color: fillColor ? '#fff' : '#333', fontWeight: isToday ? 700 : 500, fontSize: isHighlighted ? 16 : 14 }}>
                      {date.getDate()}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    );
  }

  function LegendItem({ color, text, eventKey, isToday = false }) {
    const isSelected = isToday ? highlightToday : highlightedCategory === eventKey;
    return (
      <Box onClick={() => {
        if (isToday) {
          setHighlightToday(!highlightToday);
        } else {
          setHighlightedCategory(prev => prev === eventKey ? null : eventKey);
        }
      }} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
        <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: color, border: isSelected ? `2px solid ${colorPalette.header}` : 'none', boxShadow: `0 1px 3px ${color}44` }} />
        <Typography sx={{ fontSize: 12, color: isSelected ? colorPalette.header : '#555', fontWeight: isSelected ? 600 : 500 }}>{text}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f7f7fb' }}>
      <Box ref={scrollerRef} sx={{ maxWidth: 900, mx: 'auto', p: 2, pb: 8, overflowY: 'auto' }}>
        {/* Intro */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#424242', mb: 1 }}>Period Tracker</Typography>
          <Typography sx={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
            Monitoring your cycle might provide you greater insight into your periods and general health. Additionally, it might help you plan so that you are always ready.  Discover how to use our Period & Ovulation Tracker to monitor your monthly period and ovulation.
            <br /><br />
            Planning is made easier when periods are tracked, and ovulation days are ideal for couples attempting to conceive.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={() => setShowDetails(!showDetails)} startIcon={showDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />} sx={{ color: colorPalette.header }}>
              {showDetails ? 'Show less' : 'More details'}
            </Button>
          </Box>
          {showDetails && (
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: `${colorPalette.header}1F` }}>
              <Box sx={{ fontWeight: 700, color: colorPalette.header, mb: 1 }}>What is a Period Tracker?</Box>
              <Typography sx={{ fontSize: 14, color: '#555', mb: 1.5 }}>
                - This helps you to keep a track of your upcoming periods, to pre-plan, organise with all the essentials for your period. (the monthly shedding (bleeding) of the uterine lining that happens when pregnancy doesn't occur)
                <br />- It gives the list of upcoming cycles to you.
              </Typography>
              <Box sx={{ fontWeight: 700, color: colorPalette.header, mb: 1 }}>What is an Ovulation Tracker?</Box>
              <Typography sx={{ fontSize: 14, color: '#555', mb: 1.5 }}>
                This helps you to know the ovulation time. Ovulation, which usually occurs around the middle of a cycle, is the stage of the menstrual cycle during which an egg is released from an ovary. It is the only time for conception.
              </Typography>
              <Box sx={{ fontWeight: 700, color: colorPalette.header, mb: 1 }}>Details required to track your periods and know your ovulation days</Box>
              <Typography sx={{ fontSize: 14, color: '#555' }}>
                Last Period Start Date - This date is supposed to be the first day of your last period. Cycle Length - Number of days your cycles last. For better results keep a count of these dates and days.
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Form */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff', mb: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handlePredict(); }}>
            <TextField fullWidth label="Enter your name" value={name} onChange={(e) => setName(e.target.value)} InputProps={{ startAdornment: null }} sx={{ mb: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Last period start date"
                format="DD-MM-YYYY"
                value={lastPeriodISO ? dayjs(lastPeriodISO) : null}
                onChange={(newVal) => {
                  if (!newVal || !newVal.isValid?.()) {
                    setLastPeriodISO('');
                    setLastPeriodDisplay('');
                    return;
                  }
                  const iso = newVal.format('YYYY-MM-DD');
                  const disp = newVal.format('DD-MM-YYYY');
                  setLastPeriodISO(iso);
                  setLastPeriodDisplay(disp);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: 'DD-MM-YYYY',
                  }
                }}
                sx={{ mb: 2, width: '100%' }}
              />
            </LocalizationProvider>
            <TextField fullWidth label="Cycle length (days)" type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} sx={{ mb: 1 }} />
            <FormControlLabel control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} sx={{ color: colorPalette.header, '&.Mui-checked': { color: colorPalette.header } }} />} label={<Typography sx={{ fontSize: 14, color: '#444' }}>I consent to receive helpful cycle reminders and updates.</Typography>} />
            {consent && (
              <>
                <TextField fullWidth label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ mb: 2, mt: 1 }} />
                <TextField fullWidth label="Email (optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
              </>
            )}
            <Button fullWidth type="submit" disabled={submitting} startIcon={<Analytics />} variant="contained" sx={{ backgroundColor: colorPalette.header, '&:hover': { backgroundColor: '#32408f' }, borderRadius: 2, height: 48 }}>
              Predict
            </Button>
          </Box>
        </Paper>

        {/* Calendar */}
        {hasResults && (
          <Paper ref={calendarRef} elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <CalendarHeader />
            <WeekdayRow />
            <CalendarGrid />
          </Paper>
        )}

        {/* Legend */}
        {hasResults && (
          <Paper ref={legendRef} elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff', mb: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#424242', mb: 2 }}>Legend</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <LegendItem color={colorPalette.prePeriod} text="Pre-Period" eventKey="Pre-Period" />
              <LegendItem color={colorPalette.period} text="Period" eventKey="Period" />
              <LegendItem color={colorPalette.ovulation} text="Ovulation" eventKey="Peak Ovulation" />
              <LegendItem color={colorPalette.fertile} text="Fertile" eventKey="Fertile" />
              <LegendItem color={colorPalette.today} text={"Today's Date"} isToday />
            </Box>
          </Paper>
        )}

        {/* Educational Info */}
        {hasResults && (
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff', mb: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#424242', mb: 2 }}>Understanding Your Cycle</Typography>
            {[{ c: colorPalette.prePeriod, t: 'Pre-Period:', d: 'Days just before your periods having symptoms like mood swings, food cravings, fatigue, tender breasts irritability are pre-period days.' }, { c: colorPalette.period, t: 'Period Days:', d: 'It refers to time in your menstrual cycle when you bleed (it lasts for 3 to 7 days, which is normal).' }, { c: colorPalette.ovulation, t: 'Peak Ovulation:', d: 'It is the most fertile time in your menstrual cycle.' }, { c: colorPalette.fertile, t: 'Fertile Days:', d: 'The five days leading up to ovulation, plus the day of ovulation and the day after ovulation significantly increases your chances of conception.' }].map((it, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: it.c, boxShadow: `0 1px 3px ${it.c}44`, mt: '2px' }} />
                <Box sx={{ ml: 1.5 }}>
                  <Typography sx={{ fontSize: 14, color: it.c, fontWeight: 700 }}>{it.t}</Typography>
                  <Typography sx={{ fontSize: 14, color: '#555' }}>{it.d}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {/* Disclaimer */}
        {hasResults && (
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff', mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#e53935', mb: 1 }}>Note/ Disclaimer:</Typography>
            <Typography sx={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>
              It is merely an estimate to use this period tracker. These findings may differ depending on your particular menstrual cycle. You must keep an eye on your body and record any changes in your cycle. Always consult your doctor or another trained healthcare professional if you have any queries about a medical problem.
            </Typography>
          </Paper>
        )}
      </Box>

      {hasResults && (
        <IconButton onClick={() => {
          const target = isAtBottom ? scrollerRef.current : legendRef.current || calendarRef.current;
          if (target && scrollerRef.current) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }} sx={{ position: 'fixed', right: 16, bottom: 16, backgroundColor: colorPalette.header, color: '#fff', '&:hover': { backgroundColor: '#32408f' } }}>
          {isAtBottom ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </IconButton>
      )}
    </Box>
  );
}

function ArrowUpIcon() { return <KeyboardArrowUp sx={{ color: '#fff' }} />; }
function ArrowDownIcon() { return <KeyboardArrowDown sx={{ color: '#fff' }} />; }


