import React from 'react'
import { Link } from 'react-router-dom'

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Compound Interest: The Eighth Wonder of the World",
      excerpt: "Learn how compound interest works and why it's considered one of the most powerful forces in finance.",
      date: "May 15, 2024",
      category: "Financial",
      image: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 2,
      title: "5 Common Mistakes When Calculating Your BMI",
      excerpt: "Discover the pitfalls many people encounter when using BMI calculators and how to avoid them.",
      date: "May 8, 2024",
      category: "Health",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 3,
      title: "How to Create a Budget That Actually Works",
      excerpt: "Practical tips for creating a realistic budget that you can stick to in the long term.",
      date: "April 30, 2024",
      category: "Financial",
      image: "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 4,
      title: "The Mathematics Behind Mortgage Calculations",
      excerpt: "A deep dive into the formulas and principles that power mortgage calculators.",
      date: "April 22, 2024",
      category: "Financial",
      image: "https://images.pexels.com/photos/7821485/pexels-photo-7821485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 5,
      title: "Calculating Macros: A Beginner's Guide to Nutrition",
      excerpt: "Learn how to calculate and track your macronutrients for optimal health and fitness results.",
      date: "April 15, 2024",
      category: "Health",
      image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      id: 6,
      title: "Statistics Made Simple: Understanding the Basics",
      excerpt: "A beginner-friendly introduction to statistical concepts and calculations.",
      date: "April 8, 2024",
      category: "Math",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>CalcLogic Blog</h1>
        <p className="calculator-description">
          Explore our articles on financial planning, health metrics, mathematical concepts, and more.
        </p>
      </div>

      <div className="blog-categories" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        margin: '2rem 0',
        flexWrap: 'wrap'
      }}>
        <Link to="/blog" style={{ 
          padding: '0.5rem 1rem', 
          background: '#4a90e2', 
          color: 'white', 
          borderRadius: '4px', 
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          All Posts
        </Link>
        <Link to="/blog?category=Financial" style={{ 
          padding: '0.5rem 1rem', 
          background: '#f8fafc', 
          color: '#333', 
          borderRadius: '4px', 
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Financial
        </Link>
        <Link to="/blog?category=Health" style={{ 
          padding: '0.5rem 1rem', 
          background: '#f8fafc', 
          color: '#333', 
          borderRadius: '4px', 
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Health
        </Link>
        <Link to="/blog?category=Math" style={{ 
          padding: '0.5rem 1rem', 
          background: '#f8fafc', 
          color: '#333', 
          borderRadius: '4px', 
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Math
        </Link>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {blogPosts.map(post => (
          <div key={post.id} style={{ 
            background: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}>
            <img 
              src={post.image} 
              alt={post.title} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1.5rem' }}>
              <span style={{ 
                display: 'inline-block', 
                background: '#f0f9ff', 
                color: '#4a90e2', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px',
                fontSize: '0.875rem',
                marginBottom: '0.75rem'
              }}>
                {post.category}
              </span>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{post.title}</h2>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#888', fontSize: '0.875rem' }}>{post.date}</span>
                <Link to={`/blog/${post.id}`} style={{ 
                  color: '#4a90e2', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '3rem',
        marginBottom: '2rem'
      }}>
        <button style={{ 
          background: '#f8fafc', 
          color: '#4a90e2', 
          border: '1px solid #4a90e2', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '1rem'
        }}>
          Load More Posts
        </button>
      </div>
    </div>
  )
}

export default Blog