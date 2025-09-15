import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Avatar,
  Stack,
  Button,
  IconButton,
  CardMedia,
  Grid,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { teal } from '@mui/material/colors';
import { blogService } from '../../../services/User/HealthBlogs/blog.service';
import ImageIcon from '@mui/icons-material/Image';
import dummyImage from '../../../assets/dummyBlogImage.jpeg';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState({}); // { blogPostId: true/false }
  
  const getReadingTimeInMinutes = (htmlString) => {
    const text = (htmlString || '').replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        console.log('[BlogDetail] route id:', id);
        const current = await blogService.getBlogById(id);
        if (!mounted) return;
        console.log('[BlogDetail] loaded current blog:', current);
        setBlog(current || null);
        // Fetch related from all posts and exclude current
        try {
          const currentCategoryId = (current && (current.categoryId || current.category?.categoryId || current.category_id)) || null;
          console.log('[BlogDetail] current categoryId:', currentCategoryId);

          let categoryPosts = [];
          try {
            if (currentCategoryId) {
              const catRes = await blogService.getBlogsByCategory(currentCategoryId);
              categoryPosts = (catRes?.posts || catRes || []).filter(b => b.blogPostId !== id);
              console.log('[BlogDetail] category posts count:', categoryPosts.length);
            }
          } catch (catErr) {
            console.warn('[BlogDetail] category fetch failed, will fallback to all posts', catErr);
          }

          let allPosts = [];
          try {
            const all = await blogService.getAllBlogs();
            allPosts = all?.posts || all || [];
          } catch (allErr) {
            console.warn('[BlogDetail] all posts fetch failed', allErr);
          }

          // Prefer same-category; fallback to any
          let selected = (categoryPosts.length ? categoryPosts : allPosts.filter(b => b.blogPostId !== id)).slice(0, 3);

          // If fewer than 3, fill from remaining allPosts
          if (selected.length < 3 && allPosts.length) {
            const existingIds = new Set(selected.map(s => s.blogPostId));
            const fill = allPosts.filter(b => b.blogPostId !== id && !existingIds.has(b.blogPostId));
            selected = selected.concat(fill.slice(0, 3 - selected.length));
          }

          // Final guarantee: repeat if dataset tiny
          if (selected.length < 3 && (categoryPosts.length || allPosts.length)) {
            const pool = (categoryPosts.length ? categoryPosts : allPosts).filter(b => b.blogPostId !== id);
            let i = 0;
            while (selected.length < 3 && pool.length > 0) {
              selected.push(pool[i % pool.length]);
              i += 1;
            }
          }

          console.log('[BlogDetail] related selected:', selected.map(p => p.blogPostId));
          setRelated(selected);
        } catch (_) {
          setRelated([]);
        }
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load blog');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleImageError = (id) => {
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return <Box sx={{ py: 8, textAlign: 'center' }}><Typography>Loading blog...</Typography></Box>;
  }
  if (error || !blog) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" color="error" align="center">Blog not found</Typography>
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ background: '#f7f9fc', minHeight: '100vh' }}>
      {/* HERO IMAGE - directly under header */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        {imageError[blog.blogPostId] ? (
          <Box sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            aspectRatio: '16 / 9',
          }}>
            <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={dummyImage}
            alt={blog.title}
            onError={() => handleImageError(blog.blogPostId)}
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
            }}
          />
        )}
        {/* subtle gradient overlay for readability */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none'
        }} />
        {/* Back icon on image */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          <ArrowBackIcon sx={{ color: teal[700] }} />
        </IconButton>
        {/* Title overlay on large screens */}
        <Container maxWidth="lg" sx={{ position: 'absolute', bottom: { xs: 12, md: 24 }, left: 0, right: 0 }}>
          <Typography 
            variant="h2"
            fontWeight={800}
            sx={{
              color: '#fff',
              textShadow: '0 2px 8px rgba(0,0,0,0.35)',
              fontSize: { xs: '1.8rem', md: '3rem' },
              lineHeight: 1.2
            }}
          >
            {blog.title}
          </Typography>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ maxWidth: 1000, pt: 0, pb: { xs: 4, md: 8 } }}>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: teal[400] }}>B</Avatar>
          <Typography variant="body2" color="text.secondary">
            {new Date(blog.createdAt).toLocaleDateString()} • {getReadingTimeInMinutes(blog.message)} min read
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3, opacity: 0.2 }} />

        <Box sx={{
          maxWidth: 900,
          mx: 'auto',
          px: { xs: 0, md: 0 },
        }}>
          <Box sx={{
            '& .blog-content': {
              color: 'rgba(0,0,0,0.85)',
              fontSize: { xs: '1.05rem', md: '1.14rem' },
              lineHeight: 1.9
            },
            '& .blog-content p': {
              margin: '0 0 1.1em 0'
            },
            '& .blog-content h1, & .blog-content h2, & .blog-content h3': {
              color: teal[800],
              marginTop: '1.6em',
              marginBottom: '0.6em'
            },
            '& .blog-content blockquote': {
              margin: '1.5em 0',
              paddingLeft: '1em',
              borderLeft: '4px solid rgba(0,150,136,0.25)',
              color: 'rgba(0,0,0,0.7)'
            },
            '& .blog-content img': {
              maxWidth: '100%',
              borderRadius: 2,
              display: 'block',
              margin: '16px auto'
            },
            '& .blog-content ul, & .blog-content ol': {
              paddingLeft: '1.25em'
            }
          }}>
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.message }} />
          </Box>
        </Box>

        {/* Related Articles Section */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            mb={4} 
            color={teal[800]}
            sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' } }}
          >
            You may also like
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
            {related.map((rel) => (
              <Grid item xs={12} sm={6} md={4} key={rel.blogPostId} display="flex" justifyContent="center">
                <Box 
                  sx={{ 
                    background: '#fff',
                    borderRadius: 3,
                    overflow: 'hidden',
                    maxWidth: 360,
                    mx: 'auto',
                    cursor: 'pointer',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
                    }
                  }}
                  onClick={() => navigate(`/health-blogs/${rel.blogPostId}`)}
                >
                  {imageError[rel.blogPostId] ? (
                    <Box sx={{
                      aspectRatio: '16 / 9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                    }}>
                      <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                    </Box>
                  ) : (
                    <CardMedia
                      component="img"
                      image={dummyImage}
                      alt={rel.title}
                      onError={() => handleImageError(rel.blogPostId)}
                      sx={{ 
                        width: '100%',
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Avatar sx={{ bgcolor: teal[400], width: 28, height: 28, fontSize: 14 }}>B</Avatar>
                      <Typography variant="caption" fontWeight={600}>Blog Author</Typography>
                      <Typography variant="caption" color="text.secondary">• {new Date(rel.createdAt).toLocaleDateString()}</Typography>
                    </Stack>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight={700} 
                      gutterBottom 
                      sx={{ color: teal[700] }}
                    >
                      {rel.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      mb={2}
                      sx={{ 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {rel.message.replace(/<[^>]+>/g, '').slice(0, 100)}...
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      sx={{ 
                        borderRadius: 2, 
                        textTransform: 'none', 
                        fontWeight: 600, 
                        px: 0,
                        color: teal[700],
                        '&:hover': {
                          backgroundColor: 'rgba(0, 150, 136, 0.08)'
                        }
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogDetail; 